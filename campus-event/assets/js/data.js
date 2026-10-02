// assets/js/data.js
const defaultEvents = [
    {
        id: 1,
        title: 'อบรมเชิงปฏิบัติการ Artificial Intelligence & Prompt Engineering',
        club: 'ชมรมคอมพิวเตอร์และปัญญาประดิษฐ์',
        category: 'วิชาการ',
        date: '28 ต.ค. 2569 (13:00 - 16:30)',
        location: 'ห้องปฏิบัติการคอมพิวเตอร์ อาคารนวัตกรรม ชั้น 3',
        maxCapacity: 60,
        registeredCount: 42,
        status: 'เปิดรับสมัคร',
        description: 'เรียนรู้เทคนิคการใช้งาน AI สมัยใหม่และการเขียน Prompt ขั้นสูงเพื่อเพิ่มประสิทธิภาพการเรียนและการทำงาน'
    },
    {
        id: 2,
        title: 'การแข่งขันกีฬาอีสปอร์ตเชื่อมความสัมพันธ์มหาวิทยาลัย (Valorant & ROV)',
        club: 'ชมรมอีสปอร์ตและเกมมิ่ง',
        category: 'กีฬา',
        date: '5 พ.ย. 2569 (09:00 - 18:00)',
        location: 'ลานกิจกรรมอเนกประสงค์ อาคารกิจการนักศึกษา',
        maxCapacity: 100,
        registeredCount: 100,
        status: 'เต็มแล้ว',
        description: 'การแข่งขันอีสปอร์ตประจำปี ชิงถ้วยเกียรติยศและทุนการศึกษา พร้อมบูธกิจกรรมเกมมิ่งมากมาย'
    },
    {
        id: 3,
        title: 'ค่ายอาสาพัฒนาโรงเรียนชนบทและปลูกป่าชายเลน',
        club: 'ชมรมอาสาพัฒนาและบำเพ็ญประโยชน์',
        category: 'บำเพ็ญประโยชน์',
        date: '12-14 พ.ย. 2569',
        location: 'จังหวัดสมุทรสงคราม',
        maxCapacity: 50,
        registeredCount: 35,
        status: 'เปิดรับสมัคร',
        description: 'ร่วมทาสีอาคารเรียน ปรับปรุงห้องสมุด และปลูกป่าชายเลนเพื่ออนุรักษ์สิ่งแวดล้อม'
    },
    {
        id: 4,
        title: 'มหกรรมดนตรีและประกวดวงดนตรีโฟล์คซองสร้างสรรค์',
        club: 'ชมรมดนตรีสากลและศิลปวัฒนธรรม',
        category: 'ศิลปวัฒนธรรม',
        date: '20 พ.ย. 2569 (17:00 - 21:00)',
        location: 'เวทีกลางแจ้ง 60 พรรษา',
        maxCapacity: 200,
        registeredCount: 150,
        status: 'เปิดรับสมัคร',
        description: 'พบกับการแสดงดนตรีจากวงดนตรีชมรมต่างๆ และการประกวดโฟล์คซองชิงเงินรางวัล'
    }
];

const defaultRegistrations = [
    { eventId: 1, studentId: 'STD-660142', studentName: 'นายนวัตกรรม นักศึกษา', checkedIn: true },
    { eventId: 3, studentId: 'STD-660142', studentName: 'นายนวัตกรรม นักศึกษา', checkedIn: false },
    { eventId: 1, studentId: 'STD-660101', studentName: 'นายสมชาย ใจดี', checkedIn: false },
    { eventId: 1, studentId: 'STD-660102', studentName: 'นางสาวสมหญิง รักเรียน', checkedIn: true },
    { eventId: 2, studentId: 'STD-660105', studentName: 'นายเกมเมอร์ โปร', checkedIn: true }
];