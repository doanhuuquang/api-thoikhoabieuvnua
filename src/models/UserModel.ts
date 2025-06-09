import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    studentCode: { type: String, required: true, unique: true }, // Mã sinh viên
    name: { type: String, required: true }, // Tên sinh viên
    dateOfBirth: { type: String }, // Ngày sinh
    gender: { type: String }, // Giới tính
    status: { type: String }, // Trạng thái
    className: { type: String }, // Tên lớp
    faculty: { type: String }, // Khoa
    educationProgram: { type: String }, // Chương trình đào tạo
    major: { type: String }, // Ngành học
    academicYear: { type: String }, // Niên khóa
    phoneNumber: { type: String }, // Số điện thoại
    eduEmail: { type: String }, // Email edu
    personalEmail: { type: String }, // Email cá nhân
    placeOfBirth: { type: String }, // Nơi sinh
    identityNumber: { type: String }, // Số CMND/CCCD
    identityIssuedPlace: { type: String }, // Nơi cấp CMND/CCCD
    nationality: { type: String }, // Quốc tịch
    ethnicity: { type: String }, // Dân tộc
    bankAccountNumber: { type: String }, // Số tài khoản ngân hàng
    password: { type: String, required: true }, // Mật khẩu
  },
  { collection: "users" }
);

export default mongoose.model("User", userSchema);
