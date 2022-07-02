import { Injectable } from '@nestjs/common';
import { data, ReportType } from 'src/data';
import { ReportResponseDto } from 'src/dtos/report.dto';
import { uuid } from 'uuidv4';

interface Report {
  amount: number;
  source: string;
}
interface UpdateReport {
  amount?: number;
  source?: string;
}
@Injectable()
export class ReportService {
  // Get All Reports
  getAllReports(type: ReportType): ReportResponseDto[] {
    return data.report
      .filter((report) => report.type === type)
      .map((report) => new ReportResponseDto(report));
  }

  // Get Report By ID
  getReportById(type: ReportType, id: string) {
    const report = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);
    if (!report) return;
    return new ReportResponseDto(report);
  }

  // CReate Report
  createReport(
    type: ReportType,
    { amount, source }: Report,
  ): ReportResponseDto {
    const newReport = {
      id: uuid(),
      source,
      amount,
      created_at: new Date(),
      updated_at: new Date(),
      type,
    };
    data.report.push(newReport);
    return new ReportResponseDto(newReport);
  }

  // UPdate Report
  updateReport(
    type: ReportType,
    id: string,
    body: UpdateReport,
  ): ReportResponseDto {
    const reportToUpdate = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    // if no report
    if (!reportToUpdate) return;

    const reportIndex = data.report.findIndex(
      (report) => report.id === reportToUpdate.id,
    );

    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...body,
      updated_at: new Date(),
    };
    return new ReportResponseDto(data.report[reportIndex]);
  }

  // Delete Report
  deleteReport(id: string) {
    const reportIndex = data.report.findIndex((report) => report.id === id);

    if (reportIndex === -1) return;
    data.report.splice(reportIndex, 1);
    return;
  }
}
