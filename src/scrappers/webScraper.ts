import { chromium, Browser, BrowserContext, Page, Locator } from "playwright";
import { User } from "../models/User";
import { Schedule } from "../models/Schedule";
import { Subject } from "../models/Subject";
import { ScheduleParser } from "./scheduleParse";

const URL_DAO_TAO_VNUA = "https://daotao.vnua.edu.vn/";

const LINK_BUTTON_TKB_TUAN =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[9]/li/div[1]/a[1]";
const LINK_BUTTON_TKB_HK =
  "/html/body/app-root/div/div/div/div[1]/div/div/div[2]/app-right/app-chucnang/div/div[2]/ul[10]/li/div[1]/a[1]";

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

const HEADLESS_MODE = true;
const TIMEOUT = 5000;

export class WebScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  async init() {
    this.browser = await chromium.launch({
      headless: HEADLESS_MODE,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.context = await this.browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    });
  }

  async cleanup() {
    if (this.browser) await this.browser.close();
  }

  async loginWeb(studentCode: string, password: string): Promise<Page> {
    if (!this.context) throw new Error("Browser context not initialized");
    const page = await this.context.newPage();
    try {
      await page.goto(URL_DAO_TAO_VNUA);
      await this.waitForPageLoad(page);

      await page.fill(USER_NAME_INPUT, studentCode);
      await page.fill(PASSWORD_INPUT, password);
      await page.click(LOGIN_BUTTON);

      await this.waitForPageLoad(page);
      return page;
    } catch (e) {
      await page.close();
      throw new Error("Không thể đăng nhập vào trang đào tạo");
    }
  }

  async verifyStudentLoginOnWeb(
    studentCode: string,
    password: string
  ): Promise<User> {
    let page: Page | null = null;
    try {
      page = await this.loginWeb(studentCode, password);
      await page.waitForSelector(`xpath=${USER_NAME_LOGGED}`, {
        timeout: TIMEOUT,
        state: "visible",
      });
      const userName = await page.innerText(`xpath=${USER_NAME_LOGGED}`);
      return new User(userName, studentCode, password);
    } catch (e) {
      throw new Error("Thông tin đăng nhập của sinh viên không đúng");
    } finally {
      if (page) await page.close();
    }
  }

  async fetchScheduleOnWeb(
    studentCode: string,
    password: string,
    semesterCode: string
  ): Promise<Schedule> {
    let page: Page | null = null;
    try {
      page = await this.loginWeb(studentCode, password);
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
    } finally {
      if (page) await page.close();
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
