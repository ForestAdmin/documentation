// run with 
// node scripts/delete-unused-image.js 

const fs = require('fs');
const path = require('path');

function getReferencedImages(documentationDirectory) {
    const referencedImages = new Set();
  
    function exploreDirectory(directory) {
      const files = fs.readdirSync(directory);
  
      files.forEach(file => {
        const filePath = path.join(directory, file);
  
        if (fs.statSync(filePath).isDirectory()) {
          // Recursively explore subdirectories
          exploreDirectory(filePath);
        } else if (file.endsWith('.md')) {
          // Process only md files
          const content = fs.readFileSync(filePath, 'utf-8');
          
          const referencedFiles = content.match(/assets\/.*\.(png|jpg|svg|gif)/g);
          
          if (referencedFiles) {
            referencedFiles.forEach(file => referencedImages.add(file));
          }
        }
      });
    }
  
    exploreDirectory(documentationDirectory);
    return referencedImages;
  }

function deleteUnusedFiles(pngDirectory, referencedImages) {
  const allImages = fs.readdirSync(pngDirectory)
  .filter(file => file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.jpg') || file.endsWith('.gif'));

  allImages.forEach(pngFile => {
    if (!referencedImages.has(`assets/${pngFile}`)) {
      const filePath = path.join(pngDirectory, pngFile);
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  });
}

const documentationDirectory = './';
const pngDirectory = './.gitbook/assets';

const referencedImages = getReferencedImages(documentationDirectory);
deleteUnusedFiles(pngDirectory, referencedImages);