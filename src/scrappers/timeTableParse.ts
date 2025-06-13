import * as cheerio from "cheerio";
import { Subject } from "../models/Subject";

export class TimeTableParser {
  private semesterStartDate: string;

  constructor(semesterStartDate: string) {
    this.semesterStartDate = semesterStartDate;
  }

  parseHtmlToDocument(html: string) {
    return cheerio.load(html);
  }

  getTimeTable(html: string): Map<string, Subject[]> {
    const schedules = new Map<string, Subject[]>();
    const $ = this.parseHtmlToDocument(html);

    const table = $("tbody").first();
    const rows = table.find("tr").toArray();

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      let cols = $(row)
        .find("td")
        .toArray()
        .filter((col) => !$(col).hasClass("d-none"));

      if (cols.length === 0) continue;

      const subject = this.getSubject($, table, rowIndex);

      const weekString = $(cols[cols.length - 1]).text();

      const day = this.getDayOfWeek($, table, rowIndex);

      if (day === null || !subject) continue;

      let weekCount = 1;
      for (const c of weekString) {
        if (/\d/.test(c)) {
          const weekStart = new Date(this.semesterStartDate);
          weekStart.setDate(weekStart.getDate() + (weekCount - 1) * 7);
          const subjectDate = this.getDateOfWeek(weekStart, day);

          const key = subjectDate.toISOString().slice(0, 10);
          if (!schedules.has(key)) schedules.set(key, []);
          const subjectCopy = new Subject(
            subject.code,
            subject.name,
            subject.group,
            subject.credit,
            subject.classCode,
            subject.start,
            subject.numberOfLessons,
            subject.room,
            subject.lecturerName,
            subjectDate.toISOString().slice(0, 10)
          );
          schedules.get(key)!.push(subjectCopy);
        }
        weekCount++;
      }
    }
    return schedules;
  }

  private getDayOfWeek(
    $: cheerio.CheerioAPI,
    table: any,
    rowIndex: number
  ): number | null {
    const row = table.find("tr").eq(rowIndex);
    let cols = row
      .find("td")
      .toArray()
      .filter((col: any) => !$(col).hasClass("d-none"));

    if (cols.length === 0) return null;

    let dayOfWeekStr: string;
    if (cols.length < 7) {
      dayOfWeekStr = $(cols[0]).text();
    } else {
      dayOfWeekStr = $(cols[5]).text();
    }

    return this.getDayOfWeekFromString(dayOfWeekStr);
  }

  private getSubject(
    $: cheerio.CheerioAPI,
    table: any,
    rowIndex: number
  ): Subject | null {
    try {
      const row = table.find("tr").eq(rowIndex);
      let cols = row
        .find("td")
        .toArray()
        .filter((col: any) => !$(col).hasClass("d-none"));

      if (cols.length === 0) return null;

      let subject: Subject = new Subject("", "", "", 0, "", 0, 0, "", "", "");

      if (cols.length < 7 && rowIndex > 0) {
        for (let i = rowIndex - 1; i >= 0; i--) {
          const rowParent = table.find("tr").eq(i);
          let parentCols = rowParent
            .find("td")
            .toArray()
            .filter((col: any) => !$(col).hasClass("d-none"));
          const hasRowspan = parentCols.some((td: any) =>
            $(td).attr("rowspan")
          );
          if (hasRowspan && parentCols.length > 0) {
            subject.code = $(parentCols[0]).text().trim();
            subject.name = $(parentCols[1]).text().trim();
            subject.group = $(parentCols[2]).text().trim();
            subject.credit = this.safeParseInt($(parentCols[3]).text().trim());
            subject.classCode = $(parentCols[4]).text().trim();
            break;
          }
        }
        if (cols.length > 4) {
          subject.start = this.safeParseInt($(cols[1]).text().trim());
          subject.numberOfLessons = this.safeParseInt($(cols[2]).text().trim());
          subject.room = $(cols[3]).text().trim();
          const lecturerName = $(cols[4]).text().trim();
          subject.lecturerName =
            lecturerName !== "" ? lecturerName : "Đang cập nhật";
        }
      } else if (cols.length >= 10) {
        subject.code = $(cols[0]).text().trim();
        subject.name = $(cols[1]).text().trim();
        subject.group = $(cols[2]).text().trim();
        subject.credit = this.safeParseInt($(cols[3]).text().trim());
        subject.classCode = $(cols[4]).text().trim();
        subject.start = this.safeParseInt($(cols[6]).text().trim());
        subject.numberOfLessons = this.safeParseInt($(cols[7]).text().trim());
        subject.room = $(cols[8]).text().trim();
        const lecturerName = $(cols[9]).text().trim();
        subject.lecturerName =
          lecturerName !== "" ? lecturerName : "Đang cập nhật";
      }
      return subject;
    } catch (e) {
      return null;
    }
  }

  // 0=Sunday, 1=Monday, ..., 6=Saturday
  public getDayOfWeekFromString(dayOfWeekStr: string): number | null {
    const s = dayOfWeekStr.trim().toUpperCase();
    if (s === "CN") return 0;
    if (s === "2") return 1;
    if (s === "3") return 2;
    if (s === "4") return 3;
    if (s === "5") return 4;
    if (s === "6") return 5;
    if (s === "7") return 6;
    return null;
  }

  private getDateOfWeek(weekStartDate: Date, dayOfWeek: number): Date {
    const result = new Date(weekStartDate);

    // Tính ngày đầu tuần (Thứ 2)
    const currentDayOfWeek = weekStartDate.getDay();
    const daysToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    // Chuyển về Thứ 2
    result.setDate(result.getDate() + daysToMonday);

    // Thêm số ngày để đến ngày cần thiết
    const daysToAdd = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    result.setDate(result.getDate() + daysToAdd);

    return result;
  }

  private safeParseInt(value: string): number {
    const n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  }
}
