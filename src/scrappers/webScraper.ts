import { chromium, Browser, BrowserContext, Page } from "playwright";
import { User } from "../models/User";
import { TimeTableSchedule } from "../models/TimeTableSchedule";
import { ExamSchedule } from "../models/ExamSchedule";
import { TimeTableScheduleParse } from "./timeTableScheduleParse";
import { ExamScheduleParse } from "./examScheduleParse";
import { ExamSubject } from "../models/ExamSubject";

const URL_DAO_TAO_VNUA = "https://daotao.vnua.edu.vn/";

// Xpath cho các nút chức năng
const LINK_BUTTON_TKB_TUAN =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[9]/li/div[1]/a[1]";
const LINK_BUTTON_TKB_HK =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[10]/li/div[1]/a[1]";
const LINK_BUTTON_THONG_TIN_SINH_VIEN =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[16]/li/div[1]/a[1]";
const LINK_BUTTON_TKB_LICH_THI =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[12]/li/div[1]/a[1]";

// Xpath cho các trường đăng nhập
const USER_NAME_INPUT = "input[name='username']";
const PASSWORD_INPUT = "input[name='password']";
const LOGIN_BUTTON = "button:has-text('Đăng nhập')";
const USER_NAME_LOGGED =
  "/html/body/app-root[1]/div/div/div/div[1]/div/div/div[2]/app-right/app-login/div/div[2]/div[1]/table/tr[2]/td[2]/span";

// Xpath của các trường thông tin thời khóa biểu
const WEEK_COMBO_BOX_XPATH =
  '//*[@id="fullScreen"]/div[2]/div[2]/div[1]/ng-select';
const SEMESTER_COMBO_BOX_TUAN_XPATH =
  "/html/body/app-root[1]/div/div/div/div[1]/div/div/div[1]/app-thoikhoabieu-tuan/div[1]/div[2]/div[1]/div[1]/ng-select/div/div";
const SEMESTER_COMBO_BOX_HK_XPATH =
  "/html/body/app-root[1]/div/div/div/div[1]/div/div/div[1]/app-tkb-hocky/div/div[2]/div[1]/div/ng-select/div";
const DROP_DOWN_ITEM_SELECTOR = ".ng-option";

// Xpath của các trường thông tin sinh viên
const STUDENT_CODE_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[2]/div[1]/div[2]"; // Mã sinh viên
const STUDENT_NAME_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[2]/div[2]/div[2]"; // Tên sinh viên
const STUDENT_DATE_OF_BIRTH_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[2]/div[3]/div[2]"; // Ngày sinh
const STUDENT_GENDER_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[2]/div[4]/div[2]"; // Giới tính
const STUDENT_STATUS_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[2]/div[5]/div[2]"; // Trạng thái
const STUDENT_CLASS_NAME_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[3]/div[1]/div[2]"; // Tên lớp
const STUDENT_FACULTY_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[3]/div[2]/div[2]"; // Khoa
const STUDENT_EDUCATION_PROGRAM_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[3]/div[3]/div[2]"; // Chương trình đào tạo
const STUDENT_MAJOR_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[3]/div[4]/div[2]"; // Ngành học
const STUDENT_ACADEMIC_YEAR_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[1]/div/div[3]/div[5]/div[2]"; // Niên khóa
const STUDENT_PHONE_NUMBER_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[1]/div[1]/input"; // Số điện thoại
const STUDENT_EDU_EMAIL_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[1]/div[2]/input"; // Email edu
const STUDENT_PERSONAL_EMAIL_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[1]/div[3]/input"; // Email cá nhân
const STUDENT_PLACE_OF_BIRTH_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[2]/div/input"; // Nơi sinh
const STUDENT_IDENTITY_NUMBER_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[4]/div[1]/input"; // Số CMND/CCCD
const STUDENT_IDENTITY_ISSUED_PLACE_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[4]/div[3]/input"; // Nơi cấp CMND/CCCD
const STUDENT_NATIONALITY_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[5]/div[1]/ng-select/div/div/div[2]/span[2]"; // Quốc tịch
const STUDENT_ETHNICITY_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[5]/div[2]/ng-select/div/div/div[2]/span[2]"; // Dân tộc
const STUDENT_BANK_ACCOUNT_NUMBER_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lylich-main/div/mat-horizontal-stepper/div/div[2]/div[1]/app-tt-lylich/div[2]/div[7]/div[3]/input"; // Số tài khoản ngân hàng

// Xpath của các trường thông tin lịch thi
const SEMESTER_COMBO_BOX_LICH_THI_XPATH =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[1]/app-lichthi/div/div[2]/div[1]/div[1]/div[1]/div/ng-select/div/div/div[3]";

const HEADLESS_MODE = true;
const TIMEOUT = 10000;

interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
}

export class WebScraper {
  private async createBrowserSession(): Promise<BrowserSession> {
    const browser = await chromium.launch({
      headless: HEADLESS_MODE,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
      ],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    });

    return { browser, context };
  }

  private async cleanupBrowserSession(session: BrowserSession) {
    try {
      if (session.context) {
        await session.context.close();
      }
    } catch (e) {
      console.error("Error closing context:", e);
    }

    try {
      if (session.browser) {
        await session.browser.close();
      }
    } catch (e) {
      console.error("Error closing browser:", e);
    }
  }

  // Đăng nhập vào trang đào tạo VNUA
  // Trả về Page và BrowserSession để sử dụng sau này
  async loginWeb(
    studentCode: string,
    password: string
  ): Promise<{ page: Page; session: BrowserSession }> {
    const session = await this.createBrowserSession();
    const page = await session.context.newPage();

    try {
      await page.goto(URL_DAO_TAO_VNUA);
      await this.waitForPageLoad(page);

      await page.fill(USER_NAME_INPUT, studentCode);
      await page.fill(PASSWORD_INPUT, password);
      await page.click(LOGIN_BUTTON);

      await this.waitForPageLoad(page);

      try {
        await page.waitForSelector(`xpath=${USER_NAME_LOGGED}`, {
          timeout: TIMEOUT,
          state: "visible",
        });
        return { page, session };
      } catch (loginError) {
        await page.close();
        await this.cleanupBrowserSession(session);

        throw new Error("Thông tin đăng nhập không chính xác");
      }
    } catch (e) {
      await page.close();
      await this.cleanupBrowserSession(session);

      throw new Error("Không thể đăng nhập vào trang đào tạo");
    }
  }

  // Xác thực thông tin đăng nhập của sinh viên trên trang đào tạo
  // Trả về thông tin, lịch thi của sinh viên nếu đăng nhập thành công
  async verifyStudentLoginOnWeb(
    studentCode: string,
    password: string
  ): Promise<User> {
    let page: Page | null = null;
    let session: BrowserSession | null = null;

    try {
      const loginResult = await this.loginWeb(studentCode, password);
      console.log("Đăng nhập thành công");

      page = loginResult.page;
      session = loginResult.session;

      const user: User = await this.fetchStudentInfoOnWeb(page);

      return user;
    } catch (e) {
      throw new Error("Thông tin đăng nhập của sinh viên không đúng");
    } finally {
      if (page) {
        await page.close();
      }
      if (session) {
        await this.cleanupBrowserSession(session);
      }
    }
  }

  // Lấy thông tin sinh viên từ trang đào tạo
  // Trả về một đối tượng User chứa thông tin sinh viên
  async fetchStudentInfoOnWeb(page: Page): Promise<User> {
    try {
      await this.redirectToStudentInforPage(page);

      await this.waitForElementSelector(page, `xpath=${STUDENT_CODE_XPATH}`);
      await this.waitForElementSelector(page, `xpath=${STUDENT_NAME_XPATH}`);
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_DATE_OF_BIRTH_XPATH}`
      );
      await this.waitForElementSelector(page, `xpath=${STUDENT_GENDER_XPATH}`);
      await this.waitForElementSelector(page, `xpath=${STUDENT_STATUS_XPATH}`);
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_CLASS_NAME_XPATH}`
      );
      await this.waitForElementSelector(page, `xpath=${STUDENT_FACULTY_XPATH}`);
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_EDUCATION_PROGRAM_XPATH}`
      );
      await this.waitForElementSelector(page, `xpath=${STUDENT_MAJOR_XPATH}`);
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_ACADEMIC_YEAR_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_PHONE_NUMBER_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_EDU_EMAIL_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_PERSONAL_EMAIL_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_PLACE_OF_BIRTH_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_IDENTITY_NUMBER_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_IDENTITY_ISSUED_PLACE_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_NATIONALITY_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_ETHNICITY_XPATH}`
      );
      await this.waitForElementSelector(
        page,
        `xpath=${STUDENT_BANK_ACCOUNT_NUMBER_XPATH}`
      );

      const studentCode = (
        await page.textContent(`xpath=${STUDENT_CODE_XPATH}`)
      )?.trim();
      const name = (
        await page.textContent(`xpath=${STUDENT_NAME_XPATH}`)
      )?.trim();
      const dateOfBirth = (
        await page.textContent(`xpath=${STUDENT_DATE_OF_BIRTH_XPATH}`)
      )?.trim();
      const gender = (
        await page.textContent(`xpath=${STUDENT_GENDER_XPATH}`)
      )?.trim();
      const status = (
        await page.textContent(`xpath=${STUDENT_STATUS_XPATH}`)
      )?.trim();
      const className = (
        await page.textContent(`xpath=${STUDENT_CLASS_NAME_XPATH}`)
      )?.trim();
      const faculty = (
        await page.textContent(`xpath=${STUDENT_FACULTY_XPATH}`)
      )?.trim();
      const educationProgram = (
        await page.textContent(`xpath=${STUDENT_EDUCATION_PROGRAM_XPATH}`)
      )?.trim();
      const major = (
        await page.textContent(`xpath=${STUDENT_MAJOR_XPATH}`)
      )?.trim();
      const academicYear = (
        await page.textContent(`xpath=${STUDENT_ACADEMIC_YEAR_XPATH}`)
      )?.trim();
      const phoneNumber = (
        await page.inputValue(`xpath=${STUDENT_PHONE_NUMBER_XPATH}`)
      ).trim();
      const eduEmail = (
        await page.inputValue(`xpath=${STUDENT_EDU_EMAIL_XPATH}`)
      ).trim();
      const personalEmail = (
        await page.inputValue(`xpath=${STUDENT_PERSONAL_EMAIL_XPATH}`)
      ).trim();
      const placeOfBirth = (
        await page.inputValue(`xpath=${STUDENT_PLACE_OF_BIRTH_XPATH}`)
      ).trim();
      const identityNumber = (
        await page.inputValue(`xpath=${STUDENT_IDENTITY_NUMBER_XPATH}`)
      ).trim();
      const identityIssuedPlace = (
        await page.inputValue(`xpath=${STUDENT_IDENTITY_ISSUED_PLACE_XPATH}`)
      ).trim();
      const nationality = (
        await page.innerText(`xpath=${STUDENT_NATIONALITY_XPATH}`)
      ).trim();
      const ethnicity = (
        await page.innerText(`xpath=${STUDENT_ETHNICITY_XPATH}`)
      ).trim();
      const bankAccountNumber = (
        await page.inputValue(`xpath=${STUDENT_BANK_ACCOUNT_NUMBER_XPATH}`)
      ).trim();

      return new User({
        studentCode,
        name,
        dateOfBirth,
        gender,
        status,
        className,
        faculty,
        educationProgram,
        major,
        academicYear,
        phoneNumber,
        eduEmail,
        personalEmail,
        placeOfBirth,
        identityNumber,
        identityIssuedPlace,
        nationality,
        ethnicity,
        bankAccountNumber,
      });
    } catch (e) {
      throw new Error("Không thể lấy thông tin người dùng");
    }
  }

  // Lấy thời khóa biểu của sinh viên của tất cả học kỳ hiện có
  // Trả về 1 mảng một đối tượng TimeTable chứa thông tin thời khóa biểu
  async fetchTimeTableSchedulesOnWeb(
    studentCode: string,
    password: string
  ): Promise<TimeTableSchedule[]> {
    let page: Page | null = null;
    let session: BrowserSession | null = null;
    const timeTableSchedules: TimeTableSchedule[] = [];

    try {
      const loginResult = await this.loginWeb(studentCode, password);
      page = loginResult.page;
      session = loginResult.session;

      await this.redirectToWeekTimeTablePage(page);
      const semesters: string[] = await this.fetchSemesterNames(
        page,
        SEMESTER_COMBO_BOX_TUAN_XPATH
      );
      let timeTableSchedule: TimeTableSchedule;

      for (const semester of semesters.slice(0, 4)) {
        timeTableSchedule = new TimeTableSchedule();

        timeTableSchedule.setSemesterString(semester);
        timeTableSchedule.setSemesterStartDate(
          (await this.fetchStartDateOfTerm(page, semester)) || ""
        );

        const html = await this.fetchTimeTableTable(page, semester);
        const timeTableScheduleParser = new TimeTableScheduleParse(
          timeTableSchedule.getSemesterStartDate()
        );

        const timeTable = timeTableScheduleParser.getTimeTable(html);
        timeTableSchedule.setSchedule(timeTable);

        timeTableSchedules.push(timeTableSchedule);
      }

      return timeTableSchedules;
    } catch (e) {
      if (e.message.includes("Thông tin đăng nhập")) {
        throw e;
      }
      throw new Error("Không thể lấy thông tin thời khóa biểu");
    } finally {
      if (page) {
        await page.close();
      }
      if (session) {
        await this.cleanupBrowserSession(session);
      }
    }
  }

  // Lấy lịch thi của sinh viên trên trang đào tạo sau khi đăng nhập thành công
  // Chỉ lấy lịch thi của 4 học kỳ gần nhất
  // Trả về nội dung HTML của bảng lịch thi
  async fetchExamSchedulesOnWeb(
    studentCode: string,
    password: string
  ): Promise<ExamSchedule[]> {
    let page: Page | null = null;
    let session: BrowserSession | null = null;
    const examSchedules: ExamSchedule[] = [];

    try {
      const loginResult = await this.loginWeb(studentCode, password);
      page = loginResult.page;
      session = loginResult.session;

      await this.redirectToExamTimeTablePage(page);

      const semesters: string[] = await this.fetchSemesterNames(
        page,
        SEMESTER_COMBO_BOX_LICH_THI_XPATH
      );

      for (const semester of semesters.slice(0, 4)) {
        const html = await this.fetchExamTable(page, semester);
        const examParser = new ExamScheduleParse();
        const examSchedule = new ExamSchedule();
        const examSubjects: ExamSubject[] = examParser.getExamSubjects(html);

        examSchedule.setSemesterString(semester);
        examSchedule.setSchedule(examSubjects);

        examSchedules.push(examSchedule);
      }

      return examSchedules;
    } catch (e) {
      throw new Error("Không thể lấy lịch thi của sinh viên");
    } finally {
      if (page) {
        await page.close();
      }
      if (session) {
        await this.cleanupBrowserSession(session);
      }
    }
  }

  // Lấy danh sách tên học kỳ từ trang
  // Trả về một mảng chứa tên các học kỳ
  async fetchSemesterNames(
    page: Page,
    semesterComboBoxXpath: string
  ): Promise<string[]> {
    try {
      await page.click(`xpath=${semesterComboBoxXpath}`);
      await this.waitForPageLoad(page);
      await page.waitForTimeout(2000);

      const semesterElements = await page.$$(DROP_DOWN_ITEM_SELECTOR);
      if (semesterElements.length === 0) {
        throw new Error("Không tìm thấy học kỳ nào trong combo box");
      }

      const semesterNames: string[] = [];
      for (const element of semesterElements) {
        const text = (await element.innerText()).trim();
        semesterNames.push(text);
      }

      return semesterNames;
    } catch (e) {
      throw new Error("Không thể lấy danh sách học kỳ");
    }
  }

  // Lấy ngày bắt đầu của học kỳ từ trang thời khóa biểu
  // Trả về ngày bắt đầu học kỳ dưới dạng chuỗi "YYYY-MM-DD"
  async fetchStartDateOfTerm(
    page: Page,
    semester: string
  ): Promise<string | null> {
    try {
      await this.redirectToWeekTimeTablePage(page);

      if (semester) {
        await page.click(`xpath=${SEMESTER_COMBO_BOX_TUAN_XPATH}`);
        await this.waitForPageLoad(page);
        await page.waitForTimeout(2000);

        const semesterList = await page.$$(DROP_DOWN_ITEM_SELECTOR);
        for (const element of semesterList) {
          const text = (await element.innerText()).trim();
          if (semester.toLowerCase() === text.toLowerCase()) {
            await element.click();
            await this.waitForPageLoad(page);
            break;
          }
        }
      }

      await page.waitForTimeout(2000);
      await page.click(`xpath=${WEEK_COMBO_BOX_XPATH}`);
      await this.waitForPageLoad(page);

      const weeks = await page.$$(DROP_DOWN_ITEM_SELECTOR);
      if (weeks.length === 0)
        throw new Error("Không tìm thấy tuần học nào trong combo box");

      const firstWeek = weeks[0];
      const weekId = await firstWeek.getAttribute("id");
      if (!weekId || !weekId.includes("-"))
        throw new Error("ID tuần học không hợp lệ: " + weekId);

      const weekNumber = parseInt(weekId.split("-")[1]) + 1;
      const weekText = await firstWeek.innerText();
      const currentWeekDate = this.parseStringToDate(weekText);
      if (!currentWeekDate)
        throw new Error("Không thể phân tích ngày từ: " + weekText);

      const result = new Date(currentWeekDate);
      result.setDate(result.getDate() - (weekNumber - 1) * 7);

      const yyyy = result.getFullYear();
      const mm = String(result.getMonth() + 1).padStart(2, "0");
      const dd = String(result.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch (e) {
      throw new Error("Không thể lấy ngày bắt đầu học kỳ");
    }
  }

  // Lấy bảng thời khóa biểu của học kỳ
  // Trả về nội dung HTML của bảng thời khóa biểu
  async fetchTimeTableTable(page: Page, semester: string): Promise<string> {
    await this.redirectToSemesterTimeTablePage(page);

    try {
      // Nếu có semester được chỉ định, chọn semester đó trước
      if (semester) {
        await page.click(`xpath=${SEMESTER_COMBO_BOX_HK_XPATH}`);
        await this.waitForPageLoad(page);
        await page.waitForTimeout(2000);

        const semesterList = await page.$$(DROP_DOWN_ITEM_SELECTOR);
        for (const element of semesterList) {
          const text = (await element.innerText()).trim();
          if (semester.toLowerCase() === text.toLowerCase()) {
            await element.click();
            await this.waitForPageLoad(page);
            await page.waitForTimeout(2000);
            break;
          }
        }
      }

      return await page.content();
    } catch (e) {
      throw new Error("Không thể lấy bảng thời khóa biểu");
    }
  }

  // Chờ đợi một phần tử có selector nhất định xuất hiện trên trang
  // Nếu không tìm thấy trong thời gian timeout, sẽ ném ra lỗi
  async waitForElementSelector(page: Page, selector: string) {
    try {
      await page.waitForSelector(selector, {
        timeout: TIMEOUT,
        state: "visible",
      });
    } catch (e) {
      throw new Error(`Không thể lấy thông tin người dùng`);
    }
  }

  // Lấy bảng lịch thi của học kỳ
  async fetchExamTable(page: Page, semester: string): Promise<string> {
    try {
      if (semester) {
        await page.click(`xpath=${SEMESTER_COMBO_BOX_LICH_THI_XPATH}`);
        await this.waitForPageLoad(page);
        await page.waitForTimeout(2000);

        const semesterList = await page.$$(DROP_DOWN_ITEM_SELECTOR);
        for (const element of semesterList) {
          const text = (await element.innerText()).trim();
          if (semester.toLowerCase() === text.toLowerCase()) {
            await element.click();
            await this.waitForPageLoad(page);
            await page.waitForTimeout(2000);
            break;
          }
        }
      }

      return await page.content();
    } catch (e) {
      throw new Error("Không thể lấy bảng lịch thi");
    }
  }

  // Chuyển hướng đến trang thông tin sinh viên
  // Nếu không thể tìm thấy phần tử, sẽ ném ra lỗi
  async redirectToStudentInforPage(page: Page) {
    try {
      await page.waitForSelector(`xpath=${LINK_BUTTON_THONG_TIN_SINH_VIEN}`, {
        timeout: TIMEOUT,
        state: "visible",
      });
      await page.click(`xpath=${LINK_BUTTON_THONG_TIN_SINH_VIEN}`);
      await this.waitForPageLoad(page);
    } catch (e) {
      throw new Error(
        "Không thể lấy thông tin sinh viên, vui lòng thử lại sau"
      );
    }
  }

  // Chuyển hướng đến trang thời khóa biểu theo tuần
  // Nếu không thể tìm thấy phần tử, sẽ ném ra lỗi
  async redirectToWeekTimeTablePage(page: Page) {
    try {
      await page.waitForSelector(`xpath=${LINK_BUTTON_TKB_TUAN}`, {
        timeout: TIMEOUT,
        state: "visible",
      });
      await page.click(`xpath=${LINK_BUTTON_TKB_TUAN}`);
      await this.waitForPageLoad(page);
    } catch (e) {
      throw new Error(
        "Không thể lấy thông tin thời khóa biểu, vui lòng thử lại sau"
      );
    }
  }

  // Chuyển hướng đến trang thời khóa biểu theo học kỳ
  // Nếu không thể tìm thấy phần tử, sẽ ném ra lỗi
  async redirectToSemesterTimeTablePage(page: Page) {
    try {
      await page.waitForSelector(`xpath=${LINK_BUTTON_TKB_HK}`, {
        timeout: TIMEOUT,
        state: "visible",
      });
      await page.click(`xpath=${LINK_BUTTON_TKB_HK}`);
      await this.waitForPageLoad(page);
    } catch (e) {
      throw new Error(
        "Không thể lấy thông tin thời khóa biểu, vui lòng thử lại sau"
      );
    }
  }

  // Chuyển hướng đến trang lịch thi
  // Nếu không thể tìm thấy phần tử, sẽ ném ra lỗi
  async redirectToExamTimeTablePage(page: Page) {
    try {
      await page.waitForSelector(`xpath=${LINK_BUTTON_TKB_LICH_THI}`, {
        timeout: TIMEOUT,
        state: "visible",
      });
      await page.click(`xpath=${LINK_BUTTON_TKB_LICH_THI}`);
      await this.waitForPageLoad(page);
    } catch (e) {
      throw new Error("Không thể lấy thông tin lịch thi, vui lòng thử lại sau");
    }
  }

  // Phân tích chuỗi ngày tháng trong định dạng "Ngày X tháng Y năm Z" nằm trong dấu ngoặc vuông
  // Ví dụ: "Lịch học [01/09/2023]" sẽ trả về ngày 01/09/2023
  parseStringToDate(dateString: string): Date | null {
    if (!dateString || !dateString.includes("[")) return null;
    const startIndex = dateString.indexOf("[");
    const endIndex = dateString.indexOf("]");
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex)
      return null;
    const insideBrackets = dateString.substring(startIndex + 1, endIndex);
    for (const part of insideBrackets.split(" ")) {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(part)) {
        const [day, month, year] = part.split("/").map(Number);
        return new Date(year, month - 1, day);
      }
    }
    return null;
  }

  // Chờ đợi trang tải xong với trạng thái "networkidle"
  // Điều này đảm bảo rằng tất cả các tài nguyên đã được tải xong
  async waitForPageLoad(page: Page) {
    await page.waitForLoadState("networkidle");
  }
}
