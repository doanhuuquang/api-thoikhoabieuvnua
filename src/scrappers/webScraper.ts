import { chromium, Browser, BrowserContext, Page, Locator } from "playwright";
import { User } from "../models/User";
import { Schedule } from "../models/Schedule";
import { ScheduleParser } from "./scheduleParse";

const URL_DAO_TAO_VNUA = "https://daotao.vnua.edu.vn/";

const LINK_BUTTON_TKB_TUAN =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[9]/li/div[1]/a[1]";
const LINK_BUTTON_TKB_HK =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[10]/li/div[1]/a[1]";
const LINK_BUTTON_THONG_TIN_SINH_VIEN =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[16]/li/div[1]/a[1]";

const USER_NAME_INPUT = "input[name='username']";
const PASSWORD_INPUT = "input[name='password']";
const LOGIN_BUTTON = "button:has-text('Đăng nhập')";
const USER_NAME_LOGGED =
  "/html/body/app-root[1]/div/div/div/div[1]/div/div/div[2]/app-right/app-login/div/div[2]/div[1]/table/tr[2]/td[2]/span";

const COMBO_BOX_XPATH = '//*[@id="fullScreen"]/div[2]/div[2]/div[1]/ng-select';
const DROP_DOWN_ITEM_SELECTOR = ".ng-option";
const SEMESTER_COMBO_BOX_XPATH =
  "/html/body/app-root[1]/div/div/div/div[1]/div/div/div[1]/app-thoikhoabieu-tuan/div[1]/div[2]/div[1]/div[1]/ng-select/div/div";
const SEMESTER_DROP_DOWN_SELECTOR = ".ng-option";
const SEMESTER_TABLE_COMBO_BOX_XPATH =
  "/html/body/app-root[1]/div/div/div/div[1]/div/div/div[1]/app-tkb-hocky/div/div[2]/div[1]/div/ng-select/div";

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

const HEADLESS_MODE = false;
const TIMEOUT = 10000;

// Interface for browser session
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

      // Lấy thông tin sinh viên sau khi đăng nhập thành công
      console.log("Bắt đầu lấy thông tin sinh viên");
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

  async fetchStudentInfoOnWeb(page: Page): Promise<User> {
    try {
      console.log("Bắt đầu lấy thông tin sinh viên từ trang đào tạo");
      await this.redirecToStudentInforPage(page);

      console.log("Chờ đợi các trường thông tin sinh viên hiển thị");
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

      console.log("Đã lấy thông tin sinh viên thành công");
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

  async redirecToStudentInforPage(page: Page) {
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

  async fetchScheduleOnWeb(
    studentCode: string,
    password: string,
    semesterCode: string
  ): Promise<Schedule> {
    let page: Page | null = null;
    let session: BrowserSession | null = null;

    try {
      const loginResult = await this.loginWeb(studentCode, password);
      page = loginResult.page;
      session = loginResult.session;

      const fullSemesterText = this.convertSemesterCode(semesterCode);

      await this.redirecToWeekSchedulePage(page);

      await page.click(`xpath=${SEMESTER_COMBO_BOX_XPATH}`);
      await this.waitForPageLoad(page);

      const schedule = new Schedule();

      const semesterList = await page.$$(SEMESTER_DROP_DOWN_SELECTOR);
      let semesterIndex = 0;
      for (const [i, element] of semesterList.entries()) {
        const text = (await element.innerText()).trim();
        if (fullSemesterText.toLowerCase() === text.toLowerCase()) {
          schedule.semesterString = text;
          await element.click();
          semesterIndex = i;
          break;
        }
      }

      await this.waitForPageLoad(page);
      const date = await this.fetchStartDateOfTerm(page);
      if (!date) {
        throw new Error("Không thể lấy ngày bắt đầu học kỳ");
      }
      schedule.semesterStartDate = date;

      const html = await this.fetchTableSchedule(page, semesterIndex);

      const scheduleParser = new ScheduleParser(schedule.semesterStartDate);
      const schedules = scheduleParser.getSchedule(html);
      schedule.schedules = schedules;

      return schedule;
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

  async redirecToWeekSchedulePage(page: Page) {
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

  async fetchSemesterNames(
    studentCode: string,
    password: string
  ): Promise<string[]> {
    let page: Page | null = null;
    let session: BrowserSession | null = null;
    try {
      const loginResult = await this.loginWeb(studentCode, password);
      page = loginResult.page;
      session = loginResult.session;

      await this.redirecToWeekSchedulePage(page);
      await page.click(`xpath=${SEMESTER_COMBO_BOX_XPATH}`);
      await this.waitForPageLoad(page);

      const semesterElements = await page.$$(SEMESTER_DROP_DOWN_SELECTOR);
      const semesterNames: string[] = [];
      for (const element of semesterElements) {
        const text = (await element.innerText()).trim();
        semesterNames.push(text);
      }
      return semesterNames;
    } finally {
      if (page) await page.close();
      if (session) await this.cleanupBrowserSession(session);
    }
  }

  async fetchSemesterList(page: Page) {
    try {
      await page.click(`xpath=${SEMESTER_COMBO_BOX_XPATH}`);
      await this.waitForPageLoad(page);
      return await page.$$(SEMESTER_DROP_DOWN_SELECTOR);
    } catch (e) {
      throw new Error("Không thể lấy danh sách học kỳ");
    }
  }

  async fetchStartDateOfTerm(page: Page): Promise<string | null> {
    try {
      await page.waitForTimeout(2000);
      await page.click(`xpath=${COMBO_BOX_XPATH}`);
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

      // Tính ngày bắt đầu học kỳ
      const result = new Date(currentWeekDate);
      result.setDate(result.getDate() - (weekNumber - 1) * 7);

      // Trả về dạng YYYY-MM-DD (không bị lệch múi giờ)
      const yyyy = result.getFullYear();
      const mm = String(result.getMonth() + 1).padStart(2, "0");
      const dd = String(result.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch (e) {
      throw new Error("Không thể lấy ngày bắt đầu học kỳ");
    }
  }

  async fetchTableSchedule(page: Page, semesterIndex: number): Promise<string> {
    try {
      await page.waitForSelector(`xpath=${LINK_BUTTON_TKB_HK}`, {
        timeout: TIMEOUT,
        state: "visible",
      });
      await page.click(`xpath=${LINK_BUTTON_TKB_HK}`);
      await this.waitForPageLoad(page);

      await page.click(`xpath=${SEMESTER_TABLE_COMBO_BOX_XPATH}`);
      await this.waitForPageLoad(page);
      await page.waitForTimeout(2000);

      const semesters = await page.$$(SEMESTER_DROP_DOWN_SELECTOR);
      await semesters[semesterIndex].click();
      await this.waitForPageLoad(page);
      await page.waitForTimeout(5000);

      return await page.content();
    } catch (e) {
      throw new Error("Không thể lấy bảng thời khóa biểu");
    }
  }

  convertSemesterCode(semesterCode: string): string {
    if (!semesterCode || semesterCode.length !== 9) return "";
    const hocKy = semesterCode.substring(0, 1);
    const namBatDau = semesterCode.substring(1, 5);
    const namKetThuc = semesterCode.substring(5, 9);
    return `Học kỳ ${hocKy} - Năm học ${namBatDau} - ${namKetThuc}`;
  }

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

  async waitForPageLoad(page: Page) {
    await page.waitForLoadState("networkidle");
  }
}

export class WebScraperStatic {
  static async verifyStudentLoginOnWeb(
    studentCode: string,
    password: string
  ): Promise<User> {
    const scraper = new WebScraper();
    return await scraper.verifyStudentLoginOnWeb(studentCode, password);
  }

  static async fetchScheduleOnWeb(
    studentCode: string,
    password: string,
    semesterCode: string
  ): Promise<Schedule> {
    const scraper = new WebScraper();
    return await scraper.fetchScheduleOnWeb(
      studentCode,
      password,
      semesterCode
    );
  }
}
