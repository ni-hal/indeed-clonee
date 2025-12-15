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

  const params = {
    ACL: 'public-read',
    Bucket: global.gConfig.s3_bucket_name,
    Body: fileContent,
    Key: key,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    fs.unlinkSync(fileName.path);
    return {
      Location: `https://${global.gConfig.s3_bucket_name}.s3.${global.gConfig.s3_region}.amazonaws.com/${key}`
    };
  } catch (error) {
    fs.unlinkSync(fileName.path);
    throw error;
  }
};

const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: global.gConfig.s3_bucket_name,
    Key: key,
  };
  
  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};

module.exports = { uploadFileToS3, deleteFileFromS3 };
