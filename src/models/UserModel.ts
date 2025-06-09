import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    studentCode: { type: String, required: true, unique: true }, // Mã sinh viên
    name: { type: String, required: true }, // Tên sinh viên
    dateOfBirth: { type: String, required: true }, // Ngày sinh
    gender: { type: String, required: true }, // Giới tính
    status: { type: String, required: true }, // Trạng thái
    className: { type: String, required: true }, // Tên lớp
    faculty: { type: String, required: true }, // Khoa
    educationProgram: { type: String, required: true }, // Chương trình đào tạo
    major: { type: String, required: true }, // Ngành học
    academicYear: { type: String, required: true }, // Niên khóa
    phoneNumber: { type: String, required: true }, // Số điện thoại
    eduEmail: { type: String, required: true }, // Email edu
    personalEmail: { type: String, required: true }, // Email cá nhân
    placeOfBirth: { type: String, required: true }, // Nơi sinh
    identityNumber: { type: String, required: true }, // Số CMND/CCCD
    identityIssuedPlace: { type: String, required: true }, // Nơi cấp CMND/CCCD
    nationality: { type: String, required: true }, // Quốc tịch
    ethnicity: { type: String, required: true }, // Dân tộc
    bankAccountNumber: { type: String, required: true }, // Số tài khoản ngân hàng
    password: { type: String, required: true }, // Mật khẩu
  },
  { collection: "users" }
);

export default mongoose.model("User", userSchema);
