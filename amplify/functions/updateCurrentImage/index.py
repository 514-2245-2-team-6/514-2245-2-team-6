import boto3

s3 = boto3.client('s3')
sns = boto3.client('sns')

BUCKET_NAME = 'projectawscrowdimages3bucket'

def lambda_handler(event, context):
    source_image = event.get('source_image')
    current_image = event.get('current_image')

    if not source_image or not current_image:
        return {
            'statusCode': 400,
            'body': 'Missing source_image or current_image in the event.'
        }

    copy_source = {
        'Bucket': BUCKET_NAME,
        'Key': source_image
    }

    s3.copy_object(
        CopySource=copy_source,
        Bucket=BUCKET_NAME,
        Key=current_image,
        ContentType='image/jpeg',
        MetadataDirective='REPLACE'
    )

    response = sns.publish(
        TopicArn='arn:aws:sns:us-east-1:241533135098:WheresWaldoUpdate',
        Subject="Where's Waldo Update",
        Message="Hey! The Where's Waldo game image has been updated, come check it out!"
    )

    print("Message sent! ID:", response['MessageId'])
    print(f"Updated {current_image} with {source_image}")

    return {
        'statusCode': 200,
        'body': f"{current_image} updated with {source_image}",
    }
