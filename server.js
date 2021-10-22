require("dotenv").config();
const express = require("express");
const ytdl = require("ytdl-core");
const compression = require("compression");
const helmet = require("helmet");
const chalk = require("chalk");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(compression());
app.use(helmet());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.get("/video-info", async (req, res) => {
  try {
    const videoUrl = req.query.videoUrl;
    const info = await ytdl.getInfo(videoUrl);

    res.json(info);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/video-download", async (req, res) => {
  try {
    const videoUrl = req.query.videoUrl;
    const itag = req.query.itag;

    const info = await ytdl.getInfo(videoUrl);
    const formats = info.formats.filter((format) => {
      return format.itag == itag;
    });

    res.header(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}.mp4"`
    );
    res.setHeader("Content-type", "video/mp4");
    res.setHeader("Content-Length", formats[0].contentLength);

    ytdl(videoUrl, {
      filter: (format) => format.itag == itag,
    }).pipe(res);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Running Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(chalk`Visit {rgb(128, 237, 153) http://localhost:${PORT}}`);
  console.log(chalk`Developed by {rgb(255, 92, 88) Andry Pebrianto}`);
});
