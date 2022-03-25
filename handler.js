const backup = require("./exec")

require("dotenv").config()

module.exports.runGitBackup = (event, context, callback) => {
  const options = {
    githubAccessToken: process.env.GITHUB_ACCESS_TOKEN,    
    organization: process.env.GITHUB_ORGANIZATION,
    s3BucketName: process.env.S3_BUCKET_NAME,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3AccessSecretKey: process.env.S3_ACCESS_SECRET_KEY,
    s3StorageClass: process.env.S3_STORAGE_CLASS
  }

  backup(options).then(() => {
    callback(null, {
      response: "all repos was succesfully backed up"
    })
  }, callback)
}
