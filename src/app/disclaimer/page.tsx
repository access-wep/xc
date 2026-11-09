import { LegalPageViewer } from '@/components/legal/LegalPageViewer'

export const metadata = {
  title: 'إخلاء المسؤولية | فكرتو',
}

export default function DisclaimerPage() {
  return (
    <LegalPageViewer
      slug="disclaimer"
      defaultTitle="إخلاء المسؤولية"
      defaultContent={`منصة فكرتو تقدم أدوات تنظيمية للمساعدة في إدارة الوقت والمهام. المنصة لا تقدم استشارات إدارية أو مالية أو قانونية متخصصة. تقع على عاتق المستخدم وحده مسؤولية تنفيذ ومتابعة مهامه الشخصية.`}
    />
  )
}
