import * as cheerio from "cheerio";
import { ExamSubject } from "../models/ExamSubject";

export class ExamScheduleParse {
  parseHtmlToDocument(html: string) {
    return cheerio.load(html);
  }

  getExamSubjects(html: string): ExamSubject[] {
    const examSubjects: ExamSubject[] = [];

    const document = this.parseHtmlToDocument(html);

    const table = document("tbody").first();
    const rows = table.find("tr").toArray();

    for (const row of rows) {
      let cols = document(row)
        .find("td")
        .toArray()
        .filter((col) => !document(col).hasClass("d-none"));

      const examSubject = this.getExamSubject(cols, document);
      if (!examSubject) continue;
      examSubjects.push(examSubject);
    }

    return examSubjects;
  }

  private getExamSubject(
    cols: any[],
    document: cheerio.CheerioAPI
  ): ExamSubject | null {
    if (cols.length < 11) return null;

    const code = document(cols[1]).text().trim();
    const name = document(cols[2]).text().trim();
    const examGroup = document(cols[3]).text().trim();
    const examGroupNumber = parseInt(document(cols[4]).text().trim(), 10);
    const numberOfStudents = parseInt(document(cols[5]).text().trim(), 10);
    const examDate = document(cols[6]).text().trim();
    const examRoom = document(cols[7]).text().trim();
    const start = parseInt(document(cols[8]).text().trim(), 10);
    const numberOfLessons = parseInt(document(cols[9]).text().trim(), 10);
    const note = document(cols[10]).text().trim();

    return new ExamSubject(
      code,
      name,
      examGroup,
      examGroupNumber,
      numberOfStudents,
      examDate,
      examRoom,
      start,
      numberOfLessons,
      note
    );
  }
}
