import json

def lambda_handler(event, context):
    body = json.loads(event.get("body", "{}"))

    mouse_left = body.get("left") # Normalized x coordinate of mouse click
    mouse_top = body.get("top") # Normalized y coordinate of mouse click
    bounding_box = body.get("bounding_box") # Bounding box of the face to click

    if not mouse_left or not mouse_top or not bounding_box:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing x, y, or bounding_box')
        }

    width = bounding_box.get("width")
    height = bounding_box.get("height")
    left = bounding_box.get("left")
    top = bounding_box.get("top")

    if not width or not height or not left or not top:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing width, height, left, or top in bounding_box')
        }

    if (
        mouse_left < left or
        mouse_left > left + width or
        mouse_top < top or
        mouse_top > top + height
    ):
        return {
            'statusCode': 200,
            'body': {
                'isCorrect': False,
                'message': 'Click not within bounding box'
            }
        }
    else:
        return {
            'statusCode': 200,
            'body': {
                'isCorrect': True,
                'message': 'Click within bounding box'
            }
        }
