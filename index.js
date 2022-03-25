const exec = require("./exec")

require("dotenv").config()

const options = {
  githubAccessToken: process.env.GITHUB_ACCESS_TOKEN,    
  organization: process.env.GITHUB_ORGANIZATION,
  s3BucketName: process.env.S3_BUCKET_NAME,
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
  s3AccessSecretKey: process.env.S3_ACCESS_SECRET_KEY,
  s3StorageClass: process.env.S3_STORAGE_CLASS
}

exec(options).then(
  () => {
    console.log("")
    console.log("all repos was succesfully backed up")
  },
  error => {
    console.log("")
    console.error(error)
  }
)
