import { DetailedStudent } from '@/types';

export const getStudentAvatarUrl = (student: Partial<DetailedStudent> | null | undefined): string => {
  if (!student) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  
  if (student.photo_url && student.photo_url.startsWith('http')) {
    return student.photo_url;
  }
  
  const birthYear = student.birth_date ? parseInt(student.birth_date.split('-')[0]) : 2012;
  const currentYear = 2026;
  const age = currentYear - birthYear;
  const isFemale = (student.gender || '').toLowerCase() === 'femenino' || (student.gender || '').toLowerCase() === 'female';

  let seed = 0;
  const key = student.id || `${student.first_name || ''}${student.last_name_1 || ''}`;
  for (let i = 0; i < key.length; i++) {
    seed += key.charCodeAt(i);
  }

  // Fotografía HD ajustada a género y rango de edad (Primaria vs Secundaria/Preparatoria)
  const kidsGirls = [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595454821991-9e061880c4ff?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200&auto=format&fit=crop&q=80'
  ];

  const kidsBoys = [
    'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=200&auto=format&fit=crop&q=80'
  ];

  const teensGirls = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
  ];

  const teensBoys = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80'
  ];

  if (age <= 12 || student.level === 'primaria') {
    const list = isFemale ? kidsGirls : kidsBoys;
    return list[seed % list.length];
  } else {
    const list = isFemale ? teensGirls : teensBoys;
    return list[seed % list.length];
  }
};
