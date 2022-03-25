const { Octokit } = require("@octokit/rest");
const stream = require("stream")
const request = require("request")
const aws = require("aws-sdk")

const requiredOptions = [
  "githubAccessToken",
  "s3BucketName",
  "s3AccessKeyId",
  "s3AccessSecretKey"
]

module.exports = async function(options) {

  requiredOptions.forEach(key => {
    if (!options[key]) {
      console.error("missing option `" + key + "`")
      process.exit(1)
    }
  })

  const octokit = new Octokit({
    auth: options.githubAccessToken,
  });
  
  async function getAllRepos() {    

    let repositories = []
    const date = new Date().toISOString()

    console.log(" ")
    console.log("Running ...")
    console.log("Collecting data from your Github repositories ...")

    for await (const response of octokit.paginate.iterator('GET /orgs/smiles-sa/repos')) {
      repositories = repositories.concat(response["data"])
    } 

    console.log("Found " + repositories.length + " repositories")
    console.log("-------------------------------------------------")
  
    prepareToStorage(repositories, date)
  }

  async function prepareToStorage(repos, date) {

    var count = 0

    for (const repo of repos){      
      const passThroughStream = new stream.PassThrough()
      const arhiveURL =
        "https://api.github.com/repos/" +
        repo.full_name +
        "/tarball/master?access_token=" +
        options.githubAccessToken
      const requestOptions = {
        url: arhiveURL,
        headers: {
          "User-Agent": "nodejs"
        }
      }

      request(requestOptions).pipe(passThroughStream)
      
      const bucketName = options.s3BucketName
      const objectName = date + "/" + repo.full_name + ".tar.gz"
      const params = {
        accessKeyId: options.s3AccessKeyId,
        secretAccessKey: options.s3AccessSecretKey,
        Bucket: bucketName,
        Key: objectName,
        Body: passThroughStream,
        StorageClass: options.s3StorageClass || "STANDARD",
        ServerSideEncryption: "AES256"
      }
      
      count++;
      if(count % 50 == 0){await new Promise(r => setTimeout(r, 250));}

      recordInS3(params, repo.full_name, count)
    }
  }

  async function recordInS3(params, repofull_name, count){
    const s3 = new aws.S3(params)    
    return new Promise((resolve, reject) => {
      s3.upload(params, (err) => {
        if (err) {
            console.log("[X] " + " Number " + count + " " + repofull_name + ".git - error")
            reject(err);
            return;
        }  
        resolve(console.log("[✓] " + " Number " + count + " " + repofull_name + ".git - done"));
      });
    });
  }

  return new Promise((resolve, reject) => {
    getAllRepos((err, data) => {
      if (err) {
          reject(err);
          return;
      }  
      resolve(data);
    });
  });
}