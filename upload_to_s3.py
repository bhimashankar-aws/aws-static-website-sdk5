import boto3
import os

bucket_name = "aws-static-website-sdk-bhimashankar-2026"

s3 = boto3.client("s3")

files = ["index.html", "style.css", "script.js"]

for file in files:
    content_type = {
        "index.html": "text/html",
        "style.css": "text/css",
        "script.js": "application/javascript"
    }[file]

    s3.upload_file(
        file,
        bucket_name,
        file,
        ExtraArgs={"ContentType": content_type}
    )

    print(f"{file} uploaded successfully!")

print("Website files uploaded to S3 successfully!")