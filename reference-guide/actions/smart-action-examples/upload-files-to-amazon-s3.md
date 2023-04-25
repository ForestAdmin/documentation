# Upload files to amazon s3

In this example we want to upload files (legal docs) for the companies collection that will be stored in Amazon S3 through a smart action. To do so we need to perform the following steps:

### Declare the smart action

In the companies.js file of the Forest folder, add the following to enable the user to access the action in the UI (by declaring the name and type of the action) and open an input form when triggering the action (by declaring fields).

```jsx
const { collection } = require('forest-express-sequelize');

collection('companies', {
  actions: [{ 
    name: 'Upload Legal Docs',
    type: 'single',
    fields: [{
      field: 'Certificate of Incorporation',
      description: 'The legal document relating to the formation of a company or corporation.',
      type: 'File',
      isRequired: true
    }, {
      field: 'Proof of address',
      description: '(Electricity, Gas, Water, Internet, Landline & Mobile Phone Invoice / Payment Schedule) no older than 3 months of the legal representative of your company',
      type: 'File',
      isRequired: true
    }, {
      field: 'Company bank statement',
      description: 'PDF including company name as well as IBAN',
      type: 'File',
      isRequired: true
    }, {
      field: 'Valid proof of ID',
      description: 'ID card or passport if the document has been issued in the EU, EFTA, or EEA / ID card or passport + resident permit or driving license if the document has been issued outside the EU, EFTA, or EEA of the legal representative of your company',
      type: 'File',
      isRequired: true
    }],
});
```

### Implement the logic of the smart action

To implement the logic that will be called upon when the action is triggered and the corresponding endpoint is called by the browser, the following has been added to the file companies.js in the routes folder.

```jsx
const express = require('express');
const S3Helper = require('../services/s3-helper');
const router = express.Router();

function uploadLegalDoc(companyId, doc, field) {
  const id = uuid();

  return new S3Helper().upload(doc, `livedemo/legal/${id}`)
    .then(() => models.companies.findById(companyId))
    .then((company) => {
      company[field] = id;
      return company.save();
    })
    .then((company) => models.documents.create({
      file_id: company[field],
      is_verified: true,
    }));
}

router.post('/actions/upload-legal-docs',
  (req, res) => {
    // Get the current company id
    let companyId = req.body.data.attributes.ids[0];

    // Get the values of the input fields entered by the admin user.
    let attrs = req.body.data.attributes.values;
    let certificate_of_incorporation = attrs['Certificate of Incorporation'];
    let proof_of_address = attrs['Proof of address'];
    let company_bank_statement = attrs['Company bank statement'];
    let passport_id = attrs['Valid proof of id'];
    
    // The business logic of the Smart Action. We use the function
    // UploadLegalDoc to upload them to our S3 repository. You can see the full
    // implementation on our Forest Live Demo repository on Github.
    return P.all([
      uploadLegalDoc(companyId, certificate_of_incorporation, 'certificate_of_incorporation_id'),
      uploadLegalDoc(companyId, proof_of_address, 'proof_of_address_id'),
      uploadLegalDoc(companyId, company_bank_statement,'bank_statement_id'),
      uploadLegalDoc(companyId, passport_id, 'passport_id'),
    ])
    .then(() => {
      // Once the upload is finished, send a success message to the admin user in the UI.
      res.send({ success: 'Legal documents are successfully uploaded.' });
    });
  });
  
  ...

module.exports = router;
```

The file required where the S3 helper is defined has been added to a services folder, as `services/s3-helper.js`.

```javascript
const P = require('bluebird');
const parseDataUri = require('parse-data-uri');
const AWS = require('aws-sdk');
const filesize = require('filesize');

function S3Helper() {
  function mapAttrs(file) {
    return {
      id: file.Key.replace('livedemo/legal/', ''),
      url: `https://s3-eu-west-1.amazonaws.com/${process.env.S3_BUCKET}/${file.Key}`,
      last_modified: file.LastModified,
      size: filesize(file.Size)
    }
  }

  this.upload = (rawData, filename) => {
    return new P((resolve, reject) => {
      // Create the S3 client.
      let s3Bucket = new AWS.S3({ params: { Bucket: process.env.S3_BUCKET }});
      let parsed = parseDataUri(rawData);
      let base64Image = rawData.replace(/^data:(image|application)\/\w+;base64,/, '');

      let data = {
        Key: filename,
        Body: new Buffer(base64Image, 'base64'),
        ContentEncoding: 'base64',
        ContentDisposition: 'inline',
        ContentType: parsed.mimeType,
        ACL: 'public-read'
      };

      // Upload the image.
      s3Bucket.upload(data, function(err, response) {
        if (err) { return reject(err); }
        return resolve(response);

        return models.companies
        .findById(companyId)
        .then((company) => {
          company.certificate_of_incorporation_id = certificateId;
          return company.save();
        })
        .then(() => {
          res.send({ success: 'Legal documents are successfully uploaded.' });
        });
      });
    });
  };

  this.files = (prefix) => {
    const s3 = new AWS.S3();

    let files = [];

    return new P((resolve, reject) => {
      return s3.listObjects({ 
        Bucket: process.env.S3_BUCKET, 
        Prefix: prefix 
      }).on('success', function handlePage(r) {
        files.push(...r.data.Contents);

        if(r.hasNextPage()) {
          r.nextPage().on('success', handlePage).send();
        } else {
          return resolve(files.map((f) => mapAttrs(f)));
        }
      }).on('error', (err) => {
        reject(err);
      }).send();
    });
  };

  this.file = (key) => {
    const s3 = new AWS.S3();

    let files = [];

    return new P((resolve, reject) => {
      return s3.listObjects({ 
        Bucket: process.env.S3_BUCKET, 
        Prefix: key,
      }).on('success', (file) => {
        return resolve(mapAttrs(file.data.Contents[0]));
      }).on('error', (err) => {
        reject(err);
      }).send();
    });
  };

  this.deleteFile = (key) => {
    const s3 = new AWS.S3();

    return new P((resolve, reject) => {
      return s3.deleteObjects({ 
        Bucket: process.env.S3_BUCKET,
        Delete: {
          Objects: [{ Key: key }]
        }
      }).on('success', () => resolve())
      .on('error', (err) => reject(err))
      .send();
    });
  };

  this.updateFile = (key, newKey) => {
    const s3 = new AWS.S3();

    return new P((resolve, reject) => {
      return s3.copyObject({ 
        Bucket: process.env.S3_BUCKET,
        CopySource: process.env.S3_BUCKET + '/' + key,
        Key: newKey,
        MetadataDirective: 'REPLACE'
      }).on('success', (file) => {
        return this
          .deleteFile(key)
          .then(() => {
            return resolve(this.file(newKey));
          });
      })
      .on('error', (err) => reject(err))
      .send();
    });
  };
}

module.exports = S3Helper;
```
