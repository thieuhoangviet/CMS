import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/images/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh.'), false);
    }
  };
  
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, 
});
  
export default upload;