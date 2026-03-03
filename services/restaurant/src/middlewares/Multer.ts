import multer from "multer";

const storage = multer.memoryStorage();

const uploadeFile = multer({ storage }).single("file");

export default uploadeFile;
