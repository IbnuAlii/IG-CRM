import type { AdminEmployee, AdminEmployeeRole, AdminEmployeeStatus } from "@/types";

export type HREmploymentType = "full_time" | "part_time" | "contractor";

export interface HREmployeeDocument {
  id: string;
  name: string;
  type: "ID" | "Contract" | "Certificate" | "Policy";
  status: "complete" | "expiring" | "missing";
  updatedAt: string;
}

export interface HREmployeeRecord extends AdminEmployee {
  employeeNumber: string;
  department: string;
  managerName: string;
  hireDate: string;
  employmentType: HREmploymentType;
  workLocation: string;
  permissionSet: string;
  emergencyContact: string;
  documents: HREmployeeDocument[];
  certifications: Array<{
    name: string;
    expiresAt: string;
    status: "current" | "expiring" | "missing";
  }>;
  leaveBalanceHours: number;
  attendanceThisWeekHours: number;
  overtimeHours: number;
  salaryType: "hourly" | "salary";
  payRate: number;
}

export type HRAttendanceStatus =
  | "clocked_in"
  | "completed"
  | "late"
  | "missed"
  | "on_leave";

export interface HRAttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  hoursWorked: number;
  overtimeHours: number;
  gpsLocation: string;
  status: HRAttendanceStatus;
  notes?: string;
}

export type HRLeaveType = "vacation" | "sick" | "personal";
export type HRLeaveStatus = "pending" | "approved" | "rejected";

export interface HRLeaveBalance {
  employeeId: string;
  employeeName: string;
  vacationHours: number;
  sickHours: number;
  personalHours: number;
  usedHours: number;
}

export interface HRLeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: HRLeaveType;
  status: HRLeaveStatus;
  startDate: string;
  endDate: string;
  requestedHours: number;
  balanceBeforeHours: number;
  managerName: string;
  submittedAt: string;
  reason: string;
  comments?: string;
}

export type HRPayFrequency = "weekly" | "bi_weekly" | "monthly";
export type HRPayrollStatus = "draft" | "review" | "approved" | "paid";

export interface HRPayrollPeriod {
  id: string;
  label: string;
  frequency: HRPayFrequency;
  startDate: string;
  endDate: string;
  payDate: string;
  status: HRPayrollStatus;
}

export interface HRPayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  salaryType: "hourly" | "salary";
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  taxWithholding: number;
  deductions: number;
  bonus: number;
  netPay: number;
  status: HRPayrollStatus;
  auditNote: string;
}

export interface HRPayslipRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  periodLabel: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  generatedAt: string;
  deliveryStatus: "queued" | "emailed" | "downloaded";
}

export type HRTrainingStatus = "not_started" | "in_progress" | "completed" | "overdue";
export type HRCertificationStatus = "current" | "expiring" | "expired" | "missing";

export interface HRTrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  courseName: string;
  category: "Safety" | "Compliance" | "Technical" | "Leadership";
  status: HRTrainingStatus;
  assignedAt: string;
  dueAt: string;
  completedAt?: string;
  score?: number;
}

export interface HRCertificationRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  certificationName: string;
  requiredFor: string[];
  issuedAt?: string;
  expiresAt?: string;
  status: HRCertificationStatus;
  reminderStatus: "none" | "queued" | "sent";
}

export interface HRJobEligibilityRecord {
  id: string;
  jobType: string;
  requiredCertification: string;
  eligibleEmployees: string[];
  blockedEmployees: string[];
}

const departmentByRole: Record<AdminEmployeeRole, string> = {
  admin: "Administration",
  manager: "Operations",
  dispatcher: "Dispatch",
  technician: "Field Service",
  hr_officer: "Human Resources",
  fleet_manager: "Fleet Operations",
  accountant: "Finance",
};

const permissionSetByRole: Record<AdminEmployeeRole, string> = {
  admin: "Company admin",
  manager: "Team manager",
  dispatcher: "Dispatch operations",
  technician: "Field worker",
  hr_officer: "HR officer",
  fleet_manager: "Fleet manager",
  accountant: "Payroll finance",
};

const employeeOverrides: Record<
  string,
  Partial<
    Pick<
      HREmployeeRecord,
      | "employeeNumber"
      | "managerName"
      | "hireDate"
      | "employmentType"
      | "workLocation"
      | "leaveBalanceHours"
      | "attendanceThisWeekHours"
      | "overtimeHours"
      | "salaryType"
      | "payRate"
      | "emergencyContact"
    >
  >
> = {
  emp_1: {
    employeeNumber: "EMP-1001",
    managerName: "Sofia Bennett",
    hireDate: "2022-04-18",
    workLocation: "Main office",
    leaveBalanceHours: 88,
    attendanceThisWeekHours: 38,
    overtimeHours: 1.5,
    salaryType: "salary",
    payRate: 76000,
    emergencyContact: "Luis Ortiz, +1 212 555 0188",
  },
  emp_2: {
    employeeNumber: "EMP-1002",
    managerName: "Sofia Bennett",
    hireDate: "2021-09-07",
    workLocation: "Field - Manhattan",
    leaveBalanceHours: 64,
    attendanceThisWeekHours: 41,
    overtimeHours: 3,
    salaryType: "hourly",
    payRate: 42,
    emergencyContact: "Rachel Brooks, +1 212 555 0162",
  },
  emp_3: {
    employeeNumber: "EMP-1003",
    managerName: "Sofia Bennett",
    hireDate: "2023-02-13",
    workLocation: "Field - Upper West Side",
    leaveBalanceHours: 72,
    attendanceThisWeekHours: 39,
    overtimeHours: 0.5,
    salaryType: "hourly",
    payRate: 39,
    emergencyContact: "Min Kim, +1 212 555 0119",
  },
  emp_4: {
    employeeNumber: "EMP-1004",
    managerName: "Sofia Bennett",
    hireDate: "2024-01-22",
    employmentType: "part_time",
    workLocation: "Field - Queens",
    leaveBalanceHours: 16,
    attendanceThisWeekHours: 18,
    overtimeHours: 0,
    salaryType: "hourly",
    payRate: 34,
    emergencyContact: "Ari Reed, +1 212 555 0133",
  },
  emp_5: {
    employeeNumber: "EMP-1005",
    managerName: "Avery Collins",
    hireDate: "2020-06-15",
    workLocation: "Main office",
    leaveBalanceHours: 104,
    attendanceThisWeekHours: 40,
    overtimeHours: 0,
    salaryType: "salary",
    payRate: 92000,
    emergencyContact: "Noah Bennett, +1 212 555 0179",
  },
};

function getDocumentSet(employee: AdminEmployee): HREmployeeDocument[] {
  const certificateStatus =
    employee.role === "technician" && employee.skills.length < 3
      ? "expiring"
      : "complete";

  return [
    {
      id: `${employee.id}-id`,
      name: "Government ID",
      type: "ID",
      status: "complete",
      updatedAt: "2026-04-12",
    },
    {
      id: `${employee.id}-contract`,
      name: "Employment contract",
      type: "Contract",
      status: "complete",
      updatedAt: "2026-01-08",
    },
    {
      id: `${employee.id}-cert`,
      name: employee.role === "technician" ? "Trade certification" : "Policy acknowledgement",
      type: employee.role === "technician" ? "Certificate" : "Policy",
      status: certificateStatus,
      updatedAt: certificateStatus === "expiring" ? "2025-11-18" : "2026-03-22",
    },
  ];
}

export function buildHREmployeeRecords(employees: AdminEmployee[]): HREmployeeRecord[] {
  return employees.map((employee, index) => {
    const overrides = employeeOverrides[employee.id] ?? {};
    const employmentType = overrides.employmentType ?? "full_time";
    const documents = getDocumentSet(employee);
    const department = departmentByRole[employee.role];

    return {
      ...employee,
      employeeNumber: overrides.employeeNumber ?? `EMP-${1100 + index}`,
      department,
      managerName: overrides.managerName ?? "Sofia Bennett",
      hireDate: overrides.hireDate ?? "2024-05-01",
      employmentType,
      workLocation: overrides.workLocation ?? employee.currentLocation ?? "Main office",
      permissionSet: permissionSetByRole[employee.role],
      emergencyContact: overrides.emergencyContact ?? "Emergency contact pending",
      documents,
      certifications: employee.skills.slice(0, 3).map((skill, skillIndex) => ({
        name: skill,
        expiresAt: skillIndex === 0 ? "2026-09-30" : "2027-03-31",
        status: documents.some((document) => document.status === "expiring")
          ? "expiring"
          : "current",
      })),
      leaveBalanceHours: overrides.leaveBalanceHours ?? 80,
      attendanceThisWeekHours: overrides.attendanceThisWeekHours ?? 40,
      overtimeHours: overrides.overtimeHours ?? 0,
      salaryType: overrides.salaryType ?? (employmentType === "part_time" ? "hourly" : "salary"),
      payRate: overrides.payRate ?? (employmentType === "part_time" ? 32 : 72000),
    };
  });
}

export function getHRStatusLabel(status: AdminEmployeeStatus) {
  const labels: Record<AdminEmployeeStatus, string> = {
    active: "Active",
    on_leave: "On Leave",
    inactive: "Inactive",
  };

  return labels[status];
}

export function buildHRAttendanceRecords(
  employees: HREmployeeRecord[],
): HRAttendanceRecord[] {
  const weekdays = [
    "2026-05-18",
    "2026-05-19",
    "2026-05-20",
    "2026-05-21",
    "2026-05-22",
  ];

  return employees.flatMap((employee, employeeIndex) =>
    weekdays.map((date, dayIndex) => {
      const onLeave = employee.status === "on_leave" && dayIndex >= 2;
      const late = employee.role === "technician" && dayIndex === employeeIndex % 4;
      const clockedIn = dayIndex === 3 && employee.status === "active";
      const missed = employee.status === "inactive";
      const hoursWorked = onLeave || missed ? 0 : late ? 7.25 : clockedIn ? 5.5 : 8;
      const overtimeHours =
        employee.overtimeHours > 0 && dayIndex === 4
          ? Math.min(employee.overtimeHours, 2)
          : 0;

      return {
        id: `${employee.id}-${date}`,
        employeeId: employee.id,
        employeeName: employee.name,
        employeeNumber: employee.employeeNumber,
        department: employee.department,
        date,
        clockIn: onLeave || missed ? undefined : late ? "09:24" : "08:02",
        clockOut: onLeave || missed || clockedIn ? undefined : overtimeHours > 0 ? "18:18" : "16:30",
        hoursWorked,
        overtimeHours,
        gpsLocation: employee.workLocation,
        status: onLeave
          ? "on_leave"
          : missed
            ? "missed"
            : clockedIn
              ? "clocked_in"
              : late
                ? "late"
                : "completed",
        notes: onLeave
          ? "Approved leave blocks attendance"
          : late
            ? "Late arrival flagged for review"
            : clockedIn
              ? "Mobile clock-in active"
              : undefined,
      };
    }),
  );
}

export function buildHRLeaveBalances(
  employees: HREmployeeRecord[],
): HRLeaveBalance[] {
  return employees.map((employee, index) => ({
    employeeId: employee.id,
    employeeName: employee.name,
    vacationHours: Math.max(8, employee.leaveBalanceHours - 24),
    sickHours: 32 + index * 4,
    personalHours: 16,
    usedHours: index === 3 ? 56 : 16 + index * 4,
  }));
}

export function buildHRLeaveRequests(
  employees: HREmployeeRecord[],
): HRLeaveRequest[] {
  const getEmployee = (index: number) => employees[index % employees.length];
  const first = getEmployee(0);
  const second = getEmployee(2);
  const third = getEmployee(3);
  const fourth = getEmployee(4);

  return [
    {
      id: "leave_1",
      employeeId: third.id,
      employeeName: third.name,
      department: third.department,
      type: "sick",
      status: "pending",
      startDate: "2026-05-25",
      endDate: "2026-05-27",
      requestedHours: 24,
      balanceBeforeHours: third.leaveBalanceHours,
      managerName: third.managerName,
      submittedAt: "2026-05-20",
      reason: "Medical recovery extension",
      comments: "Coverage needed for one emergency rotation.",
    },
    {
      id: "leave_2",
      employeeId: second.id,
      employeeName: second.name,
      department: second.department,
      type: "vacation",
      status: "approved",
      startDate: "2026-06-08",
      endDate: "2026-06-12",
      requestedHours: 40,
      balanceBeforeHours: second.leaveBalanceHours,
      managerName: second.managerName,
      submittedAt: "2026-05-17",
      reason: "Planned vacation",
      comments: "Approved after route coverage review.",
    },
    {
      id: "leave_3",
      employeeId: first.id,
      employeeName: first.name,
      department: first.department,
      type: "personal",
      status: "pending",
      startDate: "2026-05-29",
      endDate: "2026-05-29",
      requestedHours: 8,
      balanceBeforeHours: first.leaveBalanceHours,
      managerName: first.managerName,
      submittedAt: "2026-05-21",
      reason: "Family appointment",
    },
    {
      id: "leave_4",
      employeeId: fourth.id,
      employeeName: fourth.name,
      department: fourth.department,
      type: "vacation",
      status: "rejected",
      startDate: "2026-05-22",
      endDate: "2026-05-24",
      requestedHours: 24,
      balanceBeforeHours: fourth.leaveBalanceHours,
      managerName: fourth.managerName,
      submittedAt: "2026-05-16",
      reason: "Short notice time off",
      comments: "Rejected due to payroll close coverage.",
    },
  ];
}

export function buildHRPayrollPeriods(): HRPayrollPeriod[] {
  return [
    {
      id: "period_2026_05_biweekly",
      label: "May 18 - May 31, 2026",
      frequency: "bi_weekly",
      startDate: "2026-05-18",
      endDate: "2026-05-31",
      payDate: "2026-06-05",
      status: "review",
    },
    {
      id: "period_2026_05_weekly",
      label: "May 18 - May 24, 2026",
      frequency: "weekly",
      startDate: "2026-05-18",
      endDate: "2026-05-24",
      payDate: "2026-05-30",
      status: "draft",
    },
    {
      id: "period_2026_05_monthly",
      label: "May 2026",
      frequency: "monthly",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      payDate: "2026-05-31",
      status: "approved",
    },
  ];
}

export function buildHRPayrollRecords({
  employees,
  attendanceRecords,
  period,
}: {
  employees: HREmployeeRecord[];
  attendanceRecords: HRAttendanceRecord[];
  period: HRPayrollPeriod;
}): HRPayrollRecord[] {
  const multiplierByFrequency: Record<HRPayFrequency, number> = {
    weekly: 1,
    bi_weekly: 2,
    monthly: 4.33,
  };

  return employees.map((employee, index) => {
    const employeeAttendance = attendanceRecords.filter(
      (record) => record.employeeId === employee.id,
    );
    const recordedRegularHours = employeeAttendance.reduce(
      (total, record) => total + record.hoursWorked,
      0,
    );
    const recordedOvertimeHours = employeeAttendance.reduce(
      (total, record) => total + record.overtimeHours,
      0,
    );
    const periodMultiplier = multiplierByFrequency[period.frequency];
    const regularHours =
      employee.salaryType === "salary"
        ? 40 * periodMultiplier
        : Math.min(recordedRegularHours * periodMultiplier, 40 * periodMultiplier);
    const overtimeHours =
      employee.salaryType === "salary"
        ? recordedOvertimeHours
        : recordedOvertimeHours * periodMultiplier;
    const basePay =
      employee.salaryType === "salary"
        ? employee.payRate /
          (period.frequency === "monthly" ? 12 : period.frequency === "weekly" ? 52 : 26)
        : regularHours * employee.payRate;
    const overtimePay =
      employee.salaryType === "hourly" ? overtimeHours * employee.payRate * 1.5 : 0;
    const bonus = index === 1 ? 250 : index === 4 ? 400 : 0;
    const grossPay = basePay + overtimePay + bonus;
    const taxWithholding = grossPay * 0.18;
    const deductions = employee.salaryType === "salary" ? 185 : 92 + index * 8;
    const netPay = grossPay - taxWithholding - deductions;

    return {
      id: `payroll-${period.id}-${employee.id}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeNumber: employee.employeeNumber,
      department: employee.department,
      salaryType: employee.salaryType,
      regularHours,
      overtimeHours,
      grossPay,
      taxWithholding,
      deductions,
      bonus,
      netPay,
      status: period.status,
      auditNote:
        overtimeHours > 0
          ? "Overtime calculated from attendance records"
          : "Standard payroll calculation",
    };
  });
}

export function buildHRPayslipRecords(
  payrollRecords: HRPayrollRecord[],
  period: HRPayrollPeriod,
): HRPayslipRecord[] {
  return payrollRecords.map((record, index) => ({
    id: `payslip-${record.id}`,
    employeeId: record.employeeId,
    employeeName: record.employeeName,
    periodLabel: period.label,
    grossPay: record.grossPay,
    deductions: record.deductions + record.taxWithholding,
    netPay: record.netPay,
    generatedAt: index < 3 ? "2026-05-21" : "Pending",
    deliveryStatus: index === 0 ? "emailed" : index === 1 ? "downloaded" : "queued",
  }));
}

export function buildHRTrainingRecords(
  employees: HREmployeeRecord[],
): HRTrainingRecord[] {
  const courses = [
    {
      courseName: "OSHA Field Safety Refresher",
      category: "Safety" as const,
      assignedAt: "2026-05-01",
      dueAt: "2026-05-31",
    },
    {
      courseName: "Customer Data Privacy",
      category: "Compliance" as const,
      assignedAt: "2026-04-18",
      dueAt: "2026-05-24",
    },
    {
      courseName: "Advanced HVAC Diagnostics",
      category: "Technical" as const,
      assignedAt: "2026-05-10",
      dueAt: "2026-06-10",
    },
    {
      courseName: "Manager Coaching Essentials",
      category: "Leadership" as const,
      assignedAt: "2026-05-06",
      dueAt: "2026-06-06",
    },
  ];

  return employees.flatMap((employee, employeeIndex) =>
    courses
      .filter((course) => {
        if (course.category === "Technical") return employee.role === "technician";
        if (course.category === "Leadership") {
          return employee.role === "manager" || employee.role === "dispatcher";
        }
        return true;
      })
      .map((course, courseIndex) => {
        const status: HRTrainingStatus =
          employeeIndex === 3 && courseIndex === 0
            ? "overdue"
            : courseIndex === 0
              ? "completed"
              : courseIndex === 1
                ? "in_progress"
                : "not_started";

        return {
          id: `training-${employee.id}-${course.courseName.replaceAll(" ", "-").toLowerCase()}`,
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          courseName: course.courseName,
          category: course.category,
          status,
          assignedAt: course.assignedAt,
          dueAt: course.dueAt,
          completedAt: status === "completed" ? "2026-05-16" : undefined,
          score: status === "completed" ? 92 - employeeIndex : undefined,
        };
      }),
  );
}

export function buildHRCertificationRecords(
  employees: HREmployeeRecord[],
): HRCertificationRecord[] {
  return employees.flatMap((employee, index) => {
    const baseCertifications: HRCertificationRecord[] = [
      {
        id: `cert-${employee.id}-privacy`,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        certificationName: "Customer Data Handling",
        requiredFor: ["Customer communication", "Dispatch notes"],
        issuedAt: "2026-01-10",
        expiresAt: "2027-01-10",
        status: "current",
        reminderStatus: "none",
      },
    ];

    if (employee.role !== "technician") {
      return baseCertifications;
    }

    const technicalStatus: HRCertificationStatus =
      index === 3 ? "expiring" : index === 2 ? "current" : "current";

    return [
      ...baseCertifications,
      {
        id: `cert-${employee.id}-epa`,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        certificationName: "EPA 608",
        requiredFor: ["HVAC", "Refrigerant handling"],
        issuedAt: "2024-09-01",
        expiresAt: index === 3 ? "2026-05-28" : "2027-09-01",
        status: technicalStatus,
        reminderStatus: technicalStatus === "expiring" ? "queued" : "none",
      },
      {
        id: `cert-${employee.id}-electrical`,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        certificationName: "Electrical Safety",
        requiredFor: ["Electrical", "Diagnostics"],
        issuedAt: index === 2 ? undefined : "2025-03-14",
        expiresAt: index === 2 ? undefined : "2027-03-14",
        status: index === 2 ? "missing" : "current",
        reminderStatus: index === 2 ? "sent" : "none",
      },
    ];
  });
}

export function buildHRJobEligibilityRecords(
  employees: HREmployeeRecord[],
  certifications: HRCertificationRecord[],
): HRJobEligibilityRecord[] {
  const jobRequirements = [
    {
      jobType: "HVAC refrigerant service",
      requiredCertification: "EPA 608",
    },
    {
      jobType: "Electrical diagnostic",
      requiredCertification: "Electrical Safety",
    },
    {
      jobType: "Customer dispatch update",
      requiredCertification: "Customer Data Handling",
    },
  ];

  return jobRequirements.map((requirement) => {
    const relevantEmployees = employees.filter((employee) =>
      requirement.requiredCertification === "Customer Data Handling"
        ? true
        : employee.role === "technician",
    );
    const eligibleEmployees = relevantEmployees
      .filter((employee) =>
        certifications.some(
          (certification) =>
            certification.employeeId === employee.id &&
            certification.certificationName === requirement.requiredCertification &&
            ["current", "expiring"].includes(certification.status),
        ),
      )
      .map((employee) => employee.name);
    const blockedEmployees = relevantEmployees
      .filter((employee) => !eligibleEmployees.includes(employee.name))
      .map((employee) => employee.name);

    return {
      id: `eligibility-${requirement.jobType.replaceAll(" ", "-").toLowerCase()}`,
      jobType: requirement.jobType,
      requiredCertification: requirement.requiredCertification,
      eligibleEmployees,
      blockedEmployees,
    };
  });
}
