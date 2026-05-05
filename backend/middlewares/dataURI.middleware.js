import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

const getDataURI = (file) => {
  const extname = path.extname(file.originalname).toString();
  return parser.format(extname, file.buffer);
};
export default getDataURI;
