export class User {
  studentCode: string; // Mã sinh viên
  name: string; // Tên sinh viên
  dateOfBirth?: string; // Ngày sinh
  gender?: string; // Giới tính
  status?: string; // Trạng thái (Đang học, Đã tốt nghiệp, Bảo lưu, ...)
  className?: string; // Tên lớp
  faculty?: string; // Khoa
  educationProgram?: string; // Chương trình đào tạo
  major?: string; // Ngành học
  academicYear?: string; // Niên khóa
  phoneNumber?: string; // Số điện thoại
  eduEmail?: string; // Email edu
  personalEmail?: string; // Email cá nhân
  placeOfBirth?: string; // Nơi sinh
  identityNumber?: string; // Số CMND/CCCD
  identityIssuedPlace?: string; // Nơi cấp CMND/CCCD
  nationality?: string; // Quốc tịch
  ethnicity?: string; // Dân tộc
  bankAccountNumber?: string; // Số tài khoản ngân hàng
  password: string; // Mật khẩu

  constructor(init: Partial<User>) {
    Object.assign(this, init);
  }
}
