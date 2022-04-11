import fs, {
  access,
  readdir,
  writeFile,
  readFile,
  statSync,
  appendFile,
  unlink,
} from "fs";

const fileType = /^(\w+(\.(txt|log|json|yaml|xml|js))){1}$/i;
const getExtention = (filename) => {
  return filename.replace(/\w+\.{1}/gi, "");
};

export const createFile = (req, res) => {
  let file = req.body.filename;
  let content = req.body.content;
  access(`api/files/${file}`, (err) => {
    if (err) {
      if (file) {
        if (fileType.test(file)) {
          if (content) {
            if (typeof content === "string") {
              if (!fs.existsSync("./api/files")) {
                fs.mkdirSync("./api/files", {
                  recursive: true,
                });
              }
              writeFile(`api/files/${file}`, content, (err) => {
                if (err) {
                  console.log(`${req.method} failed`);
                  res.status(500).json({ message: "Server error" });
                } else {
                  console.log(`${req.method} request successful!`);
                  res
                    .status(200)
                    .json({ message: "File created successfully" });
                }
              });
            } else {
              console.log(`${req.method} failed`);
              res.status(400).json({
                message: "Type of 'content' parameter should be string",
              });
            }
          } else {
            console.log(`${req.method} failed`);
            res
              .status(400)
              .json({ message: "Please specify 'content' parameter" });
          }
        } else {
          console.log(`${req.method} failed`);
          res.status(400).json({
            message:
              "Invalid filename. Acceptable extentions: .log, .txt, .json, .yaml, .xml, .js",
          });
        }
      } else {
        console.log(`${req.method} failed`);
        res
          .status(400)
          .json({ message: "Please specify 'filename' parameter" });
      }
    } else {
      console.log(`${req.method} failed`);
      res.status(400).json({ message: "File already exists" });
    }
  });
};

export const getFiles = (req, res) => {
  readdir("api/files", (err, files) => {
    if (err) {
      console.log(files);
      console.log(`${req.method} failed`);
      res.status(500).json({ message: "Server error" });
    } else {
      res.status(200).json({
        message: "Success",
        files: files,
      });
    }
  });
};

export const getFile = (req, res) => {
  let path = req.originalUrl.replace("/", "");
  let filename = path.replace("api/files/", "");
  access("api/files", (err) => {
    if (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  readFile(path, "utf-8", (err, content) => {
    access(path, (err) => {
      if (err) {
        res
          .status(400)
          .json({ message: `No file with '${filename}' filename found` });
      } else {
        res.status(200).json({
          message: "Success",
          filename: filename,
          content: content,
          extention: getExtention(filename),
          uploadedDate: statSync(path).birthtime,
        });
      }
    });
  });
};

export const modifyFile = (req, res) => {
  let path = req.originalUrl.replace("/", "");
  let filename = path.replace("api/files/", "");
  access("api/files", (err) => {
    if (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  access(path, (err) => {
    let content = req.body.content;
    if (err) {
      res
        .status(400)
        .json({ message: `No file with '${filename}' filename found` });
    } else {
      if (content) {
        if (typeof content === "string") {
          appendFile(path, content, (err) => {
            if (err) {
              res.status(500).json({ message: "Server error" });
            }

            res.status(200).json({
              message: "Success",
              filename: filename,
              content: content,
              extention: getExtention(filename),
              uploadedDate: statSync(path).birthtime,
            });
          });
        } else {
          res
            .status(400)
            .json({ message: "Type of 'content' parameter should be string" });
        }
      } else {
        res.status(400).json({ message: "Please specify 'content' parameter" });
      }
    }
  });
};

export const deleteFile = (req, res) => {
  let path = req.originalUrl.replace("/", "");
  let filename = path.replace("api/files/", "");
  access("api/files", (err) => {
    if (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  access(path, (err) => {
    if (err) {
      res
      .status(400)
      .json({ message: `No file with '${filename}' filename found` });
    } else {
      unlink(path, (err) => {
        if (err) {
          res.status(500).json({ message: "Server error" });
        }
      })
      res.status(200).json({
        message: "File deleted successfully!",
      });
    }
  });
};
