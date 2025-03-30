import os
import sys
import subprocess
import boto3
from decimal import Decimal
import io
import json
import urllib.request
import urllib.parse
import urllib.error
import random
import logging
from PIL import Image

S3_BUCKET_NAME = "projectawscrowdimages3bucket"
PATH_TO_IMAGE = "current-image.png"
PATH_TO_CROPPED_IMAGE = "cropped-face-image.png"

logger = logging.getLogger()
logger.setLevel(logging.INFO)

rekognition = boto3.client('rekognition', region_name='us-east-1')
s3 = boto3.client('s3')


# --------------- Helper Functions to call Rekognition APIs ------------------


def detect_faces(s3_bucket_name, path_to_image):
    response = rekognition.detect_faces(Image={"S3Object": {"Bucket": s3_bucket_name, "Name": path_to_image}})
    return response

def index_faces(s3_bucket_name, path_to_image):
    # Note: Collection has to be created upfront. Use CreateCollection API to create a collecion.
    #rekognition.create_collection(CollectionId='BLUEPRINT_COLLECTION')
    response = rekognition.index_faces(Image={"S3Object": {"Bucket": s3_bucket_name, "Name": path_to_image}}, CollectionId="BLUEPRINT_COLLECTION")
    return response


# --------------- Helper Functions to crop image  ------------------


def crop_image(image_data, bounding_box):
    image = Image.open(io.BytesIO(image_data))

    width, height = image.size
    left = width * bounding_box['Left']
    top = height * bounding_box['Top']
    right = left + (width * bounding_box['Width'])
    bottom = top + (height * bounding_box['Height'])
    cropped_image = image.crop((left, top, right, bottom))
    return cropped_image


# --------------- Main handler ------------------


def lambda_handler(event, context):
    logger.info("Received event: %s", json.dumps(event, indent=2))

    s3_bucket_name = S3_BUCKET_NAME
    path_to_image = urllib.parse.unquote(PATH_TO_IMAGE)
    path_to_cropped_image = urllib.parse.unquote(PATH_TO_CROPPED_IMAGE)

    try:
        # Calls rekognition DetectFaces API to detect faces in S3 object
        response = detect_faces(s3_bucket_name, path_to_image)

        faces = response["FaceDetails"]
        num_faces = len(faces)

        if num_faces == 0:
            logger.error("No faces detected in image")
            raise Exception("No faces detected in image")

        random_face_index = random.randint(0, num_faces-1)
        random_face = faces[random_face_index]
        face_bounding_box = random_face["BoundingBox"]

        # Download image from s3 bucket
        image_obj = s3.get_object(Bucket=s3_bucket_name, Key=path_to_image)
        image_data = image_obj['Body'].read()

        cropped_image = crop_image(image_data, face_bounding_box)

        # Save the cropped image back to a new S3 location or return as a response
        cropped_image_io = io.BytesIO()
        cropped_image.save(cropped_image_io, format="JPEG")
        cropped_image_io.seek(0)


        # Upload the cropped image to S3
        s3.put_object(
            Bucket=s3_bucket_name,
            Key=path_to_cropped_image,
            Body=cropped_image_io,
            ContentType='image/jpeg'
        )

        cropped_image_url = f"https://s3.amazonaws.com/{s3_bucket_name}/{path_to_cropped_image}"

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Cropped face image successfully saved!',
                'cropped_image_url': cropped_image_url,
                'bounding_box': json.dumps(face_bounding_box)
            })
        }


    except Exception as e:
        logger.error(f"Error processing object {path_to_image} from bucket {s3_bucket_name}: {str(e)}")
        raise e
