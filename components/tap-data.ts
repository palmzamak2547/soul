export const memories = [
  { id: "mem1", date: "08 AUG 2026", title: "First day on campus", copy: "ประตูมหาวิทยาลัยในเช้าวันแรก และข้อความถึงตัวเองในอีกสี่ปีข้างหน้า", type: "Memory", state: "open", details: "ทุกอย่างดูยิ่งใหญ่และน่าตื่นเต้นไปหมด ก้าวแรกที่เดินผ่านซุ้มประตูมหาวิทยาลัย รู้สึกถึงความหวังและความท้าทายที่รออยู่ข้างหน้า วันนี้เราได้เขียนจดหมายถึงตัวเองในอนาคต เก็บไว้ใน Time Capsule หวังว่าในวันรับปริญญา เราจะกลับมาอ่านแล้วพบว่าตัวเองเติบโตขึ้นแค่ไหน" },
  { id: "mem2", date: "24 AUG 2026", title: "Orientation night", copy: "เพลงที่ร้องพร้อมกันครั้งแรก ถูกเก็บไว้ใน capsule ของรุ่น", type: "Story", state: "open", details: "แสงไฟในลานกว้างค่อยๆ หรี่ลง เสียงกีตาร์โปร่งดังขึ้น รุ่นพี่เริ่มร้องเพลงประจำมหาวิทยาลัย และไม่นานทุกคนก็ร้องตาม เป็นความรู้สึกของการเป็นส่วนหนึ่งของบางสิ่งที่ยิ่งใหญ่กว่าตัวเราเอง" },
  { id: "mem3", date: "12 FEB 2027", title: "Faculty badge earned", copy: "ปลดล็อกจากการร่วมกิจกรรมคณะครั้งที่สาม", type: "Badge", state: "open", details: "หลังจากลุยโปรเจกต์ดึกดื่นกับเพื่อนๆ ในที่สุดก็ผ่านกิจกรรมรับน้องและได้รับ Badge ของคณะอย่างเป็นทางการ นี่ไม่ใช่แค่เหรียญรางวัล แต่เป็นสัญลักษณ์ของมิตรภาพและความพยายาม" },
  { id: "mem4", date: "MAY 2030", title: "Graduation chapter", copy: "จะเปิดเมื่อถึงวันสำเร็จการศึกษา", type: "Future", state: "locked", lockedReason: "บทแห่งความสำเร็จนี้จะถูกปลดล็อกเมื่อคุณสำเร็จการศึกษาอย่างเป็นทางการ" },
];

export const demoBadges = [
  { id: "badge_first_light", name: "First Light", description: "ก้าวแรกในรั้วมหาวิทยาลัย", type: "earned" },
  { id: "badge_orientation", name: "Orientation", description: "เข้าร่วมกิจกรรมปฐมนิเทศ", type: "earned" },
  { id: "badge_faculty_pride", name: "Faculty Pride", description: "ผ่านกิจกรรมหลักของคณะ", type: "earned" },
  { id: "badge_midterm_survivor", name: "Midterm Survivor", description: "ผ่านการสอบกลางภาคครั้งแรก", type: "locked", lockedCondition: "ทำข้อสอบกลางภาคครบทุกวิชาในปี 1" },
  { id: "badge_internship", name: "Internship Ready", description: "เข้าร่วมโครงการฝึกงาน", type: "locked", lockedCondition: "ผ่านการฝึกงานภาคฤดูร้อน" },
  { id: "badge_graduation", name: "Graduation", description: "สำเร็จการศึกษา", type: "locked", lockedCondition: "จบการศึกษาตามหลักสูตร" },
];
