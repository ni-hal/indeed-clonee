const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { ObjectId } = require('mongodb');
const fs = require('fs');

const s3Client = new S3Client({
  credentials: {
    secretAccessKey: global.gConfig.s3_secret_key,
    accessKeyId: global.gConfig.s3_access_key,
  },
  region: global.gConfig.s3_region,
});

const uploadFileToS3 = async (fileName) => {
  const fileContent = fs.readFileSync(fileName.path);
  const key = new ObjectId().toString();

  const command = new PutObjectCommand({
    ACL: 'public-read',
    Bucket: global.gConfig.s3_bucket_name,
    Body: fileContent,
    Key: key,
  });

  const data = await s3Client.send(command);
  fs.unlinkSync(fileName.path);
  return { Location: `https://${global.gConfig.s3_bucket_name}.s3.${global.gConfig.s3_region}.amazonaws.com/${key}`, Key: key };
};

const deleteFileFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: global.gConfig.s3_bucket_name,
    Key: key,
  });
  return await s3Client.send(command);
};

module.exports = { uploadFileToS3, deleteFileFromS3 };
