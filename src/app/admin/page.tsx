"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  KeyRound, 
  Copy, 
  Check, 
  Search, 
  Plus, 
  UploadCloud, 
  Download, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Cpu, 
  BarChart3, 
  Activity, 
  Dumbbell, 
  Music, 
  Bot, 
  Sparkles, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2,
  Trash2,
  FileText,
  FileDown,
  Palette,
  Brain,
  Globe2,
  ImageIcon,
  Calendar,
  Layers,
  ExternalLink,
  X,
  Edit3
} from 'lucide-react';
import { useSchoolAdminStore, generateRandomPassword } from '@/store/useSchoolAdminStore';
import { DetailedStudent, Subject, GroupAnnualPlan, SyllabusTopic } from '@/types';

type AdminTab = 'overview' | 'teachers' | 'students' | 'campuses' | 'subjects' | 'config';

export default function SuperUserAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    schoolSettings,
    campusesList,
    detailedStudents,
    groupsList,
    subjectsList,
    teachersList,
    toggleUserBlock,
    changeUserPassword,
    registerStudent,
    bulkRegisterStudents,
    registerTeacher,
    createSubject,
    deleteSubject,
    updateGroupAnnualPlan,
    updateSubjectSyllabus
  } = useSchoolAdminStore();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'student') {
        router.push('/student');
      } else if (user.role === 'teacher') {
        router.push('/teacher');
      }
    }
  }, [user, authLoading, router]);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  
  // Filtros de búsqueda
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  
  const [teacherSearch, setTeacherSearch] = useState('');
  
  // Modales
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddWorkshopModal, setShowAddWorkshopModal] = useState(false);
  
  // Modal de Detalle del Taller Académico (Información + Temario + Multi-Grupo + Alumnos)
  const [selectedWorkshopDetail, setSelectedWorkshopDetail] = useState<Subject | null>(null);
  const [workshopDetailTab, setWorkshopDetailTab] = useState<'syllabus' | 'annual_plans' | 'students'>('syllabus');
  const [selectedGroupForPlan, setSelectedGroupForPlan] = useState<string>('grp-jar-4a');
  const [workshopStudentSearch, setWorkshopStudentSearch] = useState('');
  const [showEditAnnualPlanModal, setShowEditAnnualPlanModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);

  // Formulario de edición de planeación anual de grupo
  const [annualPlanForm, setAnnualPlanForm] = useState({
    plan_title: '',
    project_title: '',
    pda_focus: '',
    term_1: '',
    term_2: '',
    term_3: ''
  });

  // Formulario de nuevo bloque para el temario
  const [newTopicForm, setNewTopicForm] = useState({
    block: 'Bloque 5',
    title: '',
    weeks: '4 Semanas',
    description: '',
    deliverable: ''
  });

  const [viewSyllabusModal, setViewSyllabusModal] = useState<{ isOpen: boolean; workshopName: string; syllabusUrl?: string; filename?: string }>({
    isOpen: false,
    workshopName: ''
  });

  const [showPasswordModal, setShowPasswordModal] = useState<{ isOpen: boolean; userId: string; userName: string; role: 'teacher' | 'student'; currentPassword?: string }>({
    isOpen: false,
    userId: '',
    userName: '',
    role: 'student'
  });

  // Estado para copia y toasts
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast(`Copiado: ${text}`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Formulario de Alumno Individual
  const [newStudentForm, setNewStudentForm] = useState({
    first_name: '',
    second_name: '',
    last_name_1: '',
    last_name_2: '',
    campus_name: 'Primaria Jardines',
    level: 'primaria' as 'primaria' | 'secundaria',
    grade: '1º',
    group_id: 'grp-jar-1a',
    curp: '',
    gender: 'Masculino',
    tutor_name: '',
    emergency_contact_phone: ''
  });

  // Formulario de Profesor
  const [newTeacherForm, setNewTeacherForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    campus_name: 'Primaria Jardines',
    assigned_subjects: 'Matemáticas, Robótica',
    assigned_groups: '1ºA Jardines'
  });

  // Formulario de Materia Curricular Simple
  const [newSubjectForm, setNewSubjectForm] = useState({
    name: '',
    sep_code: '',
    category: 'curricular' as 'curricular' | 'optativa',
    is_elective: false,
    level_grade_id: 'all'
  });

  // Formulario Extendido para Nuevo Taller Académico / Optativa
  const [newWorkshopForm, setNewWorkshopForm] = useState({
    name: '',
    sep_code: '',
    workshop_category: 'tecnologico' as 'deportivo' | 'tecnologico' | 'artistico' | 'academico' | 'cientifico',
    campus_name: 'Todos los Planteles',
    instructor_name: 'Prof. Israel López',
    schedule: 'Martes y Jueves 16:00 - 17:30',
    description: '',
    image_url: '',
    syllabus_url: '',
    syllabus_filename: ''
  });

  // Carga Masiva: Texto o Archivo
  const [bulkTextInput, setBulkTextInput] = useState('');
  const [bulkPreviewList, setBulkPreviewList] = useState<Array<Partial<DetailedStudent>>>([]);
  const [, setIsParsingBulk] = useState(false);
  const [bulkGeneratedResults, setBulkGeneratedResults] = useState<DetailedStudent[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workshopImageRef = useRef<HTMLInputElement | null>(null);
  const workshopSyllabusRef = useRef<HTMLInputElement | null>(null);

  // Métrica Total de Tokens de IA Pedagógica
  const totalAITokens = useMemo(() => {
    return (teachersList || []).reduce((acc, t) => acc + (t.ai_tokens_consumed || 0), 0);
  }, [teachersList]);

  // Filtrado de Alumnos
  const filteredStudents = useMemo(() => {
    return (detailedStudents || []).filter(s => {
      const fullName = `${s.first_name} ${s.second_name || ''} ${s.last_name_1} ${s.last_name_2 || ''}`.toLowerCase();
      const matchesSearch = fullName.includes(studentSearch.toLowerCase()) || 
        (s.curp && s.curp.toLowerCase().includes(studentSearch.toLowerCase())) ||
        (s.email && s.email.toLowerCase().includes(studentSearch.toLowerCase()));

      const matchesCampus = selectedCampus === 'all' || s.campus_name?.toLowerCase() === selectedCampus.toLowerCase();
      const matchesGrade = studentGradeFilter === 'all' || s.grade === studentGradeFilter;
      const matchesStatus = studentStatusFilter === 'all' || 
        (studentStatusFilter === 'blocked' ? (s.is_blocked || s.status === 'suspendido') : (!s.is_blocked && s.status === 'activo'));

      return matchesSearch && matchesCampus && matchesGrade && matchesStatus;
    });
  }, [detailedStudents, studentSearch, selectedCampus, studentGradeFilter, studentStatusFilter]);

  // Filtrado de Profesores
  const filteredTeachers = useMemo(() => {
    return (teachersList || []).filter(t => {
      const fullName = `${t.first_name} ${t.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(teacherSearch.toLowerCase()) || 
        (t.email && t.email.toLowerCase().includes(teacherSearch.toLowerCase()));
      const matchesCampus = selectedCampus === 'all' || 
        t.campus_name?.toLowerCase() === selectedCampus.toLowerCase() || 
        t.campus_name === 'Todos los Planteles';

      return matchesSearch && matchesCampus;
    });
  }, [teachersList, teacherSearch, selectedCampus]);

  // Manejo de Creación de Alumno Individual
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.first_name || !newStudentForm.last_name_1) {
      alert('Por favor completa el nombre y primer apellido.');
      return;
    }

    const created = registerStudent({
      first_name: newStudentForm.first_name,
      second_name: newStudentForm.second_name,
      last_name_1: newStudentForm.last_name_1,
      last_name_2: newStudentForm.last_name_2,
      birth_date: '2016-01-01',
      curp: newStudentForm.curp || `${newStudentForm.last_name_1.substring(0, 2).toUpperCase()}${newStudentForm.first_name.substring(0, 2).toUpperCase()}160101HDFMRN01`,
      gender: newStudentForm.gender,
      level: newStudentForm.level,
      grade: newStudentForm.grade,
      group_id: newStudentForm.group_id,
      campus_name: newStudentForm.campus_name,
      tutor_name: newStudentForm.tutor_name,
      emergency_contact_phone: newStudentForm.emergency_contact_phone,
      status: 'activo',
      is_blocked: false,
      temporary_password: generateRandomPassword(6)
    });

    showToast(`✅ Alumno ${created.first_name} ${created.last_name_1} registrado (Contraseña: ${created.temporary_password})`);
    setShowAddStudentModal(false);
    setNewStudentForm({
      first_name: '',
      second_name: '',
      last_name_1: '',
      last_name_2: '',
      campus_name: 'Primaria Jardines',
      level: 'primaria',
      grade: '1º',
      group_id: 'grp-jar-1a',
      curp: '',
      gender: 'Masculino',
      tutor_name: '',
      emergency_contact_phone: ''
    });
  };

  // Manejo de Creación de Profesor con Permisos Exclusivos de Docente
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.first_name || !newTeacherForm.last_name) {
      alert('Por favor completa el nombre del profesor.');
      return;
    }

    const formattedEmail = newTeacherForm.email.trim() || 
      `${newTeacherForm.first_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${newTeacherForm.last_name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jjrosseau.edu.mx`;

    registerTeacher({
      first_name: newTeacherForm.first_name,
      last_name: newTeacherForm.last_name,
      email: formattedEmail,
      phone: newTeacherForm.phone,
      campus_name: newTeacherForm.campus_name,
      assigned_subjects: newTeacherForm.assigned_subjects.split(',').map(s => s.trim()),
      assigned_groups: newTeacherForm.assigned_groups.split(',').map(g => g.trim())
    });

    showToast(`✅ Profesor ${newTeacherForm.first_name} ${newTeacherForm.last_name} dado de alta con acceso exclusivo a la vista docente.`);
    setShowAddTeacherModal(false);
  };

  // Manejo de Subida de Imagen del Taller
  const handleWorkshopImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewWorkshopForm(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejo de Subida de Temario / Programa PDF
  const handleWorkshopSyllabusUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewWorkshopForm(prev => ({
          ...prev,
          syllabus_url: reader.result as string,
          syllabus_filename: file.name
        }));
        showToast(`📄 Temario cargado: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejo de Creación de Nuevo Taller Académico
  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkshopForm.name.trim()) {
      alert('Por favor ingresa el nombre del taller.');
      return;
    }

    const sepCode = newWorkshopForm.sep_code.trim() || `OPT-${newWorkshopForm.name.substring(0, 3).toUpperCase()}`;

    createSubject({
      school_id: 'sch-jjr',
      level_grade_id: 'all',
      name: newWorkshopForm.name.trim(),
      sep_code: sepCode,
      category: 'optativa',
      is_elective: true,
      workshop_category: newWorkshopForm.workshop_category,
      campus_name: newWorkshopForm.campus_name,
      instructor_name: newWorkshopForm.instructor_name,
      schedule: newWorkshopForm.schedule,
      description: newWorkshopForm.description,
      image_url: newWorkshopForm.image_url,
      syllabus_url: newWorkshopForm.syllabus_url,
      syllabus_filename: newWorkshopForm.syllabus_filename,
      assigned_group_ids: ['grp-jar-4a', 'grp-jar-5a', 'grp-tor-4a', 'grp-sec-1a'],
      syllabus_topics: [
        { block: 'Bloque 1', title: 'Fundamentos e Introducción Práctica', weeks: '4 Semanas', description: 'Conceptos clave, normas de seguridad y dinámicas de integración grupal.', deliverable: 'Evaluación diagnóstica y bitácora inicial' },
        { block: 'Bloque 2', title: 'Desarrollo de Competencias y Técnicas', weeks: '6 Semanas', description: 'Metodología estructurada de ejercicios y retos individuales.', deliverable: 'Portafolio de evidencias de medio término' },
        { block: 'Bloque 3', title: 'Proyectos Colaborativos y Estrategia', weeks: '6 Semanas', description: 'Trabajo en equipo, análisis de casos y resolución de problemas.', deliverable: 'Proyecto integrador de aplicación' },
        { block: 'Bloque 4', title: 'Exhibición Escolar y Evaluación de Cierre', weeks: '4 Semanas', description: 'Presentación final y torneo de convivencia entre planteles.', deliverable: 'Demostración práctica en la Gala de Talleres' }
      ]
    });

    showToast(`🎉 ¡Taller "${newWorkshopForm.name}" agregado y publicado exitosamente!`);
    setShowAddWorkshopModal(false);
    setNewWorkshopForm({
      name: '',
      sep_code: '',
      workshop_category: 'tecnologico',
      campus_name: 'Todos los Planteles',
      instructor_name: 'Prof. Israel López',
      schedule: 'Martes y Jueves 16:00 - 17:30',
      description: '',
      image_url: '',
      syllabus_url: '',
      syllabus_filename: ''
    });
  };

  // Guardar Edición de Planeación Anual de Grupo
  const handleSaveAnnualPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshopDetail) return;

    updateGroupAnnualPlan(selectedWorkshopDetail.id, selectedGroupForPlan, {
      plan_title: annualPlanForm.plan_title || `Planeación Anual - ${selectedWorkshopDetail.name}`,
      project_title: annualPlanForm.project_title,
      pda_focus: annualPlanForm.pda_focus,
      term_1: annualPlanForm.term_1,
      term_2: annualPlanForm.term_2,
      term_3: annualPlanForm.term_3
    });

    showToast(`✅ Planeación Anual actualizada para el grupo seleccionado.`);
    setShowEditAnnualPlanModal(false);

    // Actualizar referencia local en modal
    const updated = subjectsList.find(s => s.id === selectedWorkshopDetail.id);
    if (updated) setSelectedWorkshopDetail(updated);
  };

  // Agregar Nuevo Bloque al Temario del Taller
  const handleAddSyllabusTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshopDetail || !newTopicForm.title.trim()) return;

    const currentTopics = selectedWorkshopDetail.syllabus_topics || [];
    const updatedTopics = [
      ...currentTopics,
      {
        block: newTopicForm.block,
        title: newTopicForm.title.trim(),
        weeks: newTopicForm.weeks,
        description: newTopicForm.description,
        deliverable: newTopicForm.deliverable
      }
    ];

    updateSubjectSyllabus(selectedWorkshopDetail.id, updatedTopics);
    showToast(`✅ Nuevo bloque "${newTopicForm.title}" agregado al temario.`);
    setShowAddTopicModal(false);
    setNewTopicForm({
      block: `Bloque ${updatedTopics.length + 1}`,
      title: '',
      weeks: '4 Semanas',
      description: '',
      deliverable: ''
    });

    const updated = subjectsList.find(s => s.id === selectedWorkshopDetail.id);
    if (updated) setSelectedWorkshopDetail(updated);
  };

  // Manejo de Creación de Materia Básica
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectForm.name) return;

    createSubject({
      school_id: 'sch-jjr',
      level_grade_id: newSubjectForm.level_grade_id,
      name: newSubjectForm.name,
      sep_code: newSubjectForm.sep_code || `CURR-${newSubjectForm.name.substring(0, 3).toUpperCase()}`,
      category: newSubjectForm.category,
      is_elective: newSubjectForm.is_elective
    });

    showToast(`✅ Materia ${newSubjectForm.name} agregada.`);
    setShowAddSubjectModal(false);
  };

  // Parseo de Texto / Pegado de Excel para Carga Masiva
  const parseBulkText = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const parsed: Array<Partial<DetailedStudent>> = [];

    lines.forEach(line => {
      const parts = line.split(/[,\t;|]/).map(p => p.trim());
      if (parts.length >= 2) {
        const firstName = parts[0] || 'Alumno';
        const lastName1 = parts[1] || 'Apellido';
        const lastName2 = parts[2] && !['primaria', 'secundaria', 'jardines', 'torres', '1º', '2º', '3º', '4º', '5º', '6º'].some(k => parts[2].toLowerCase().includes(k)) 
          ? parts[2] 
          : '';
        
        let campus = 'Primaria Jardines';
        if (line.toLowerCase().includes('torres') && line.toLowerCase().includes('secundaria')) {
          campus = 'Secundaria Torres';
        } else if (line.toLowerCase().includes('torres')) {
          campus = 'Primaria Torres';
        }

        let level: 'primaria' | 'secundaria' = campus.includes('Secundaria') ? 'secundaria' : 'primaria';
        let grade = '1º';
        const gradeMatch = line.match(/([1-6])º?/);
        if (gradeMatch) {
          grade = `${gradeMatch[1]}º`;
        }

        parsed.push({
          first_name: firstName,
          last_name_1: lastName1,
          last_name_2: lastName2,
          campus_name: campus,
          level,
          grade
        });
      }
    });

    setBulkPreviewList(parsed);
  };

  // Manejo de archivo Excel / CSV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingBulk(true);
    try {
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const text = await file.text();
        setBulkTextInput(text);
        parseBulkText(text);
      } else {
        try {
          const XLSX = await import('xlsx');
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csvText = XLSX.utils.sheet_to_csv(firstSheet);
          setBulkTextInput(csvText);
          parseBulkText(csvText);
        } catch {
          const text = await file.text();
          setBulkTextInput(text);
          parseBulkText(text);
        }
      }
      showToast(`Archivo "${file.name}" cargado exitosamente.`);
    } catch {
      alert('Error al leer el archivo.');
    } finally {
      setIsParsingBulk(false);
    }
  };

  // Confirmar Carga Masiva
  const handleExecuteBulkUpload = () => {
    if (bulkPreviewList.length === 0) {
      alert('No hay alumnos para procesar. Por favor pega una lista o sube un archivo.');
      return;
    }

    const created = bulkRegisterStudents(bulkPreviewList);
    setBulkGeneratedResults(created);
    showToast(`🎉 ¡${created.length} alumnos registrados con contraseñas generadas!`);
  };

  // Exportar Sábana de Credenciales a CSV
  const exportCredentialsCSV = () => {
    const studentsToExport = bulkGeneratedResults || detailedStudents;
    const headers = 'ID,Nombre,Primer Apellido,Segundo Apellido,Plantel,Grado,Grupo,Correo Institucional,Contraseña de Acceso (6 Digitos),Estado\n';
    const rows = studentsToExport.map(s => 
      `"${s.id}","${s.first_name}","${s.last_name_1}","${s.last_name_2 || ''}","${s.campus_name || ''}","${s.grade}","${s.group_id || ''}","${s.email || ''}","${s.temporary_password || ''}","${s.is_blocked ? 'BLOQUEADO' : 'ACTIVO'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `credenciales_up_juan_jacobo_rosseau_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
    showToast('Descargando archivo CSV de credenciales...');
  };

  // Cambio directo de contraseña
  const handleDirectPasswordChange = (newPass?: string) => {
    const updatedPass = changeUserPassword(showPasswordModal.userId, showPasswordModal.role, newPass);
    showToast(`🔑 Contraseña actualizada para ${showPasswordModal.userName}: ${updatedPass}`);
    setShowPasswordModal(prev => ({ ...prev, currentPassword: updatedPass }));
  };

  // Icon Helper for Workshop Card
  const getWorkshopIcon = (sub: Subject) => {
    if (sub.workshop_category === 'deportivo') return Dumbbell;
    if (sub.workshop_category === 'tecnologico') return Bot;
    if (sub.workshop_category === 'artistico') return Palette;
    if (sub.workshop_category === 'cientifico') return Brain;
    if (sub.workshop_category === 'academico') return Globe2;

    const name = sub.name.toLowerCase();
    if (name.includes('física') || name.includes('actividad')) return Activity;
    if (name.includes('basquetbol') || name.includes('deporte')) return Dumbbell;
    if (name.includes('música')) return Music;
    if (name.includes('robótica')) return Bot;
    if (name.includes('danza')) return Sparkles;
    return Sparkles;
  };

  // Grupos disponibles para un taller
  const availableGroupsForWorkshop = useMemo(() => {
    if (!selectedWorkshopDetail) return groupsList;
    if (selectedWorkshopDetail.campus_name && selectedWorkshopDetail.campus_name !== 'Todos los Planteles') {
      return groupsList.filter(g => g.campus_name === selectedWorkshopDetail.campus_name);
    }
    return groupsList;
  }, [groupsList, selectedWorkshopDetail]);

  // Alumnos del grupo seleccionado en el taller
  const studentsInSelectedWorkshopGroup = useMemo(() => {
    if (!selectedGroupForPlan) return [];
    const targetGroup = groupsList.find(g => g.id === selectedGroupForPlan);
    
    return detailedStudents.filter(st => {
      const matchGroup = st.group_id === selectedGroupForPlan || 
        (targetGroup && st.campus_name === targetGroup.campus_name && st.grade === targetGroup.grade);
      
      const matchSearch = workshopStudentSearch === '' || 
        `${st.first_name} ${st.last_name_1}`.toLowerCase().includes(workshopStudentSearch.toLowerCase()) ||
        (st.curp && st.curp.toLowerCase().includes(workshopStudentSearch.toLowerCase()));

      return matchGroup && matchSearch;
    });
  }, [detailedStudents, groupsList, selectedGroupForPlan, workshopStudentSearch]);

  // Planeación anual activa para el grupo seleccionado
  const activeGroupPlan: GroupAnnualPlan | null = useMemo(() => {
    if (!selectedWorkshopDetail) return null;
    const plans = selectedWorkshopDetail.group_annual_plans || {};
    if (plans[selectedGroupForPlan]) {
      return plans[selectedGroupForPlan];
    }
    
    // Default generado
    const targetGrp = groupsList.find(g => g.id === selectedGroupForPlan);
    return {
      group_id: selectedGroupForPlan,
      group_name: targetGrp?.name || 'Grupo A',
      campus_name: targetGrp?.campus_name || 'Primaria Jardines',
      grade: targetGrp?.grade || '4º',
      plan_title: `Planeación Anual de ${selectedWorkshopDetail.name} - ${targetGrp?.grade || '4º'} ${targetGrp?.name || 'A'}`,
      term_1: `Trimestre 1: Diagnóstico inicial, fundamentos de ${selectedWorkshopDetail.name} y dinámicas de integración.`,
      term_2: `Trimestre 2: Desarrollo técnico, proyectos colaborativos y aplicación práctica según programa de estudio.`,
      term_3: `Trimestre 3: Evaluación formativa continua, portafolio de evidencias y exhibición final.`,
      pda_focus: `Desarrollo de habilidades motrices, cognitivas y socioemocionales aplicadas a ${selectedWorkshopDetail.name}.`,
      project_title: `Proyecto Integrador Comunitario: ${selectedWorkshopDetail.name} en Acción`,
      updated_at: new Date().toISOString()
    };
  }, [selectedWorkshopDetail, selectedGroupForPlan, groupsList]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
          <p className="text-xs font-bold text-slate-400">Verificando sesión institucional...</p>
        </div>
      </div>
    );
  }

  if (user && (user.role === 'student' || user.role === 'teacher')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-white/10 text-center space-y-4 shadow-2xl">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-black text-white">Acceso Denegado</h2>
          <p className="text-xs text-slate-400">
            {user.role === 'student' 
              ? 'Esta consola es exclusiva para la Dirección Escolar (Super Usuario). Como alumno dispones de tu propio portal de misiones y recompensas.'
              : 'Esta consola es exclusiva para la Dirección Escolar. Como docente dispones de tu Portal Académico.'}
          </p>
          <button
            onClick={() => router.push(user.role === 'student' ? '/student' : '/teacher')}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
          >
            {user.role === 'student' ? 'Ir a mi Portal de Alumno' : 'Ir a mi Portal Docente'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-indigo-400/30 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-indigo-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* SUPER USER HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">{schoolSettings.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SUPER USUARIO · BETA 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
              <span>CCT: <strong className="text-slate-300">{schoolSettings.cct}</strong></span>
              <span>·</span>
              <span>3 Planteles Oficiales</span>
              <span>·</span>
              <span>{detailedStudents.length} Alumnos</span>
              <span>·</span>
              <span>{teachersList.length} Profesores</span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCredentialsCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-bold text-slate-200 transition-all hover:scale-102 cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            Descargar Credenciales (CSV)
          </button>

          <Link
            href="/teacher"
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all hover:scale-102"
          >
            Ir a Portal Académico <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* NAVIGATION TABS STRIP */}
      <nav className="bg-slate-900 border-b border-white/5 px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Panel General
          </button>

          <button
            onClick={() => setActiveTab('campuses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'campuses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Building2 className="h-4 w-4" /> Planteles & Grupos
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Users className="h-4 w-4" /> Profesores & Tokens IA ({teachersList.length})
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Alumnos & Carga Rápida ({detailedStudents.length})
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subjects'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="h-4 w-4" /> Materias & Talleres ({subjectsList.length})
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Institución & Seguridad
          </button>
        </div>

        {/* Global Campus Selector Pill */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Plantel:</span>
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="all">🏢 Todos los Planteles</option>
            {campusesList.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </nav>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Alumnos Matriculados</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">{detailedStudents.length}</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {detailedStudents.filter(s => !s.is_blocked && s.status === 'activo').length} activos · {detailedStudents.filter(s => s.is_blocked).length} bloqueados
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Plantilla Docente</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">{teachersList.length}</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {teachersList.filter(t => !t.is_blocked).length} profesores activos
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Consumo de Tokens IA</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-purple-400">{totalAITokens.toLocaleString()}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ≈ ${(totalAITokens * 0.000015).toFixed(2)} MXN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Equiv. comercial: <strong className="text-slate-200">${(totalAITokens * 0.000015).toFixed(2)} MXN</strong> ($0.80 USD/1M tokens)
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Planteles Activos</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">{campusesList.length}</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    2 Primarias + 1 Secundaria
                  </p>
                </div>
              </div>
            </div>

            {/* Campus Breakdown Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider">Planteles de la Unidad Pedagógica</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campusesList.map(campus => {
                  const campusStudents = detailedStudents.filter(s => s.campus_name?.toLowerCase() === campus.name.toLowerCase());
                  const campusTeachers = teachersList.filter(t => t.campus_name?.toLowerCase() === campus.name.toLowerCase() || t.campus_name === 'Todos los Planteles');
                  const campusGroups = groupsList.filter(g => g.campus_name?.toLowerCase() === campus.name.toLowerCase());

                  return (
                    <div 
                      key={campus.id} 
                      className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between gap-4 shadow-xl hover:border-indigo-500/30 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                            Nivel {campus.level.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{campus.grades.length} Grados</span>
                        </div>
                        <h4 className="text-base font-black text-white mt-2.5">{campus.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-500" /> {campus.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
                        <div className="p-2 rounded-xl bg-white/5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Alumnos</span>
                          <strong className="text-sm font-black text-white">{campusStudents.length}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Docentes</span>
                          <strong className="text-sm font-black text-white">{campusTeachers.length}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Grupos</span>
                          <strong className="text-sm font-black text-white">{campusGroups.length}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">¿Deseas dar de alta nuevos alumnos para este ciclo?</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Puedes registrar alumnos de forma individual o usar la herramienta de carga rápida mediante archivo Excel.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Alta Individual
                </button>
                <button
                  onClick={() => setShowBulkUploadModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-102"
                >
                  <UploadCloud className="h-4 w-4" /> Carga Rápida (Excel / Lista)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEACHERS & AI TOKENS */}
        {activeTab === 'teachers' && (
          <div className="space-y-4">
            {/* Action & Filter Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Buscar profesor por nombre o correo..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg transition-all cursor-pointer hover:scale-102"
                >
                  <Plus className="h-4 w-4" /> Registrar Profesor
                </button>
              </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Profesor</th>
                      <th className="p-4">Plantel Asignado</th>
                      <th className="p-4">Materias & Grupos</th>
                      <th className="p-4 text-center">Tokens IA Usados</th>
                      <th className="p-4 text-center">Contraseña Acceso</th>
                      <th className="p-4 text-center">Estado</th>
                      <th className="p-4 text-right">Acciones de Super Usuario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {filteredTeachers.map(teacher => {
                      const isBlocked = teacher.is_blocked || false;
                      const tokens = teacher.ai_tokens_consumed || 0;

                      return (
                        <tr key={teacher.id} className={`hover:bg-white/5 transition-colors ${isBlocked ? 'bg-red-950/10 opacity-70' : ''}`}>
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{teacher.first_name} {teacher.last_name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3 text-slate-500" /> {teacher.email}
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-300">
                            {teacher.campus_name || 'Sin Plantel'}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(teacher.assigned_subjects || ['Matemáticas']).map((sub, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-semibold text-slate-300 border border-white/5">
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-center font-mono">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                {tokens.toLocaleString()} tokens
                              </span>
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                ≈ ${(tokens * 0.000015).toFixed(2)} MXN
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center font-mono">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-bold text-amber-400">
                              <span>{teacher.temporary_password || 'Isr9X2'}</span>
                              <button
                                onClick={() => copyToClipboard(teacher.temporary_password || 'Isr9X2', teacher.id)}
                                title="Copiar contraseña"
                                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === teacher.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {isBlocked ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                                Bloqueado
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Activo
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Botón Cambiar Contraseña */}
                              <button
                                onClick={() => setShowPasswordModal({
                                  isOpen: true,
                                  userId: teacher.id,
                                  userName: `${teacher.first_name} ${teacher.last_name}`,
                                  role: 'teacher',
                                  currentPassword: teacher.temporary_password || 'Isr9X2'
                                })}
                                title="Cambiar Contraseña Directa"
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-white/10 transition-all cursor-pointer"
                              >
                                <KeyRound className="h-4 w-4" />
                              </button>

                              {/* Botón Bloqueo Inmediato */}
                              <button
                                onClick={() => {
                                  toggleUserBlock(teacher.id, 'teacher', !isBlocked);
                                  showToast(isBlocked ? `Profesor ${teacher.first_name} desbloqueado.` : `Profesor ${teacher.first_name} bloqueado.`);
                                }}
                                title={isBlocked ? "Desbloquear Cuenta" : "Bloquear / Cancelar Cuenta"}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  isBlocked 
                                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30' 
                                    : 'bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30'
                                }`}
                              >
                                {isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENTS & BULK UPLOAD */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-white/10">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Buscar por nombre, CURP o correo..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <select
                  value={studentGradeFilter}
                  onChange={(e) => setStudentGradeFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                >
                  <option value="all">Grado: Todos</option>
                  <option value="1º">1º de Primaria</option>
                  <option value="2º">2º de Primaria</option>
                  <option value="3º">3º de Primaria</option>
                  <option value="4º">4º de Primaria</option>
                  <option value="5º">5º de Primaria</option>
                  <option value="6º">6º de Primaria</option>
                  <option value="1º Sec">1º de Secundaria</option>
                  <option value="2º Sec">2º de Secundaria</option>
                  <option value="3º Sec">3º de Secundaria</option>
                </select>

                <select
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                >
                  <option value="all">Estado: Todos</option>
                  <option value="active">Activos</option>
                  <option value="blocked">Bloqueados</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Alta Individual
                </button>
                <button
                  onClick={() => setShowBulkUploadModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg transition-all cursor-pointer hover:scale-102"
                >
                  <UploadCloud className="h-4 w-4" /> Carga Rápida (Excel)
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Estudiante</th>
                      <th className="p-4">CURP / Matrícula</th>
                      <th className="p-4">Plantel</th>
                      <th className="p-4">Grado & Grupo</th>
                      <th className="p-4 text-center">Contraseña (6 Dígitos)</th>
                      <th className="p-4 text-center">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {filteredStudents.map((student, idx) => {
                      const isBlocked = student.is_blocked || student.status === 'suspendido';
                      const tempPass = student.temporary_password || 'San7K4';

                      return (
                        <tr key={`${student.id}-${student.curp || idx}`} className={`hover:bg-white/5 transition-colors ${isBlocked ? 'bg-red-950/10 opacity-70' : ''}`}>
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">
                              {student.first_name} {student.second_name || ''} {student.last_name_1} {student.last_name_2 || ''}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3 text-slate-500" /> {student.email}
                            </div>
                          </td>
                          <td className="p-4 font-mono text-slate-300">
                            <div>{student.curp || 'SIN-CURP'}</div>
                            <div className="text-[10px] text-slate-500">{student.enrollment_id || student.id}</div>
                          </td>
                          <td className="p-4 font-semibold text-slate-300">
                            {student.campus_name || 'Primaria Jardines'}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white">
                              {student.grade} - {student.group_id?.toUpperCase() || '1ºA'}
                            </span>
                          </td>
                          <td className="p-4 text-center font-mono">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-bold text-amber-400">
                              <span>{tempPass}</span>
                              <button
                                onClick={() => copyToClipboard(tempPass, student.id)}
                                title="Copiar contraseña"
                                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === student.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {isBlocked ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                                Bloqueado
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Activo
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Botón Cambiar Contraseña */}
                              <button
                                onClick={() => setShowPasswordModal({
                                  isOpen: true,
                                  userId: student.id,
                                  userName: `${student.first_name} ${student.last_name_1}`,
                                  role: 'student',
                                  currentPassword: tempPass
                                })}
                                title="Cambiar Contraseña Directa"
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-white/10 transition-all cursor-pointer"
                              >
                                <KeyRound className="h-4 w-4" />
                              </button>

                              {/* Botón Bloqueo Inmediato */}
                              <button
                                onClick={() => {
                                  toggleUserBlock(student.id, 'student', !isBlocked);
                                  showToast(isBlocked ? `Alumno ${student.first_name} desbloqueado.` : `Alumno ${student.first_name} bloqueado.`);
                                }}
                                title={isBlocked ? "Desbloquear Cuenta" : "Bloquear / Cancelar Cuenta"}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  isBlocked 
                                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30' 
                                    : 'bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30'
                                }`}
                              >
                                {isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAMPUSES & GROUPS */}
        {activeTab === 'campuses' && (
          <div className="space-y-6">
            {campusesList.map(campus => {
              const campusGroups = groupsList.filter(g => g.campus_name?.toLowerCase() === campus.name.toLowerCase());
              
              return (
                <div key={campus.id} className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">{campus.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {campus.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span><MapPin className="h-3 w-3 inline text-slate-500" /> {campus.address}</span>
                        <span>·</span>
                        <span><Phone className="h-3 w-3 inline text-slate-500" /> {campus.phone}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 block">{campusGroups.length} Grupos Configurados</span>
                    </div>
                  </div>

                  {/* Groups Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {campus.grades.map(grade => {
                      const studentCount = detailedStudents.filter(s => s.campus_name === campus.name && s.grade === grade).length;

                      return (
                        <div key={grade} className="p-3.5 rounded-xl bg-slate-950 border border-white/10 flex flex-col justify-between gap-2 hover:border-indigo-500/30 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-indigo-400">{grade} Grado</span>
                            <span className="text-[10px] font-mono text-slate-500">Grupo A</span>
                          </div>
                          <div className="text-lg font-black text-white">
                            {studentCount} <span className="text-[10px] text-slate-400 font-normal">alumnos</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Operativo
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 5: SUBJECTS & WORKSHOPS */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            {/* Header & Add Elective Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-white/10">
              <div>
                <h3 className="text-sm font-black text-white">Catálogo Curricular & Talleres Académicos</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gestiona las materias oficiales NEM y da de alta nuevos talleres extracurriculares con temario, planeación multi-grupo y listas de alumnos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddSubjectModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Materia Curricular
                </button>
                <button
                  onClick={() => setShowAddWorkshopModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:scale-102"
                >
                  <Sparkles className="h-4 w-4" /> + Agregar Nuevo Taller Académico
                </button>
              </div>
            </div>

            {/* Materias Optativas / Talleres Académicos Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Materias Optativas & Talleres Extracurriculares ({subjectsList.filter(s => s.is_elective || s.category === 'optativa').length})
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Haz clic en cualquier taller para abrir su información, temario, planeación por grupo y alumnos</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {subjectsList.filter(s => s.is_elective || s.category === 'optativa').map(opt => {
                  const IconComp = getWorkshopIcon(opt);

                  return (
                    <div 
                      key={opt.id} 
                      onClick={() => {
                        setSelectedWorkshopDetail(opt);
                        setWorkshopDetailTab('syllabus');
                      }}
                      className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 shadow-lg flex flex-col justify-between gap-3 hover:border-amber-500/70 hover:scale-[1.01] transition-all group relative cursor-pointer"
                    >
                      {/* Top Bar: Icon/Image + Category Badge + Delete */}
                      <div className="flex items-start justify-between gap-2">
                        {opt.image_url ? (
                          <div className="h-10 w-10 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={opt.image_url} alt={opt.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                            <IconComp className="h-5 w-5" />
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/20 uppercase">
                            {opt.workshop_category || 'Optativa'}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`¿Eliminar el taller "${opt.name}"?`)) {
                                deleteSubject(opt.id);
                                showToast(`Taller "${opt.name}" eliminado.`);
                              }
                            }}
                            title="Eliminar Taller"
                            className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <h5 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                          <span>{opt.name}</span>
                          <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                        </h5>
                        <p className="text-[11px] text-slate-400 font-mono">Clave SEP: {opt.sep_code || 'OPT-2026'}</p>
                        
                        {opt.instructor_name && (
                          <p className="text-[11px] text-slate-300 flex items-center gap-1 pt-1">
                            <Users className="h-3 w-3 text-slate-500 shrink-0" />
                            <span>Instructor: <strong className="text-slate-200">{opt.instructor_name}</strong></span>
                          </p>
                        )}

                        {opt.campus_name && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
                            <span>{opt.campus_name}</span>
                          </p>
                        )}

                        {opt.schedule && (
                          <p className="text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 inline-block mt-1">
                            🕒 {opt.schedule}
                          </p>
                        )}
                      </div>

                      {/* Syllabus / Temario Action */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] font-bold text-amber-400 group-hover:underline flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5" /> Ver Temario & Grupos
                        </span>

                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Activo
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Card "+ Agregar Taller" */}
                <button
                  onClick={() => setShowAddWorkshopModal(true)}
                  className="p-5 rounded-2xl bg-slate-900/40 border-2 border-dashed border-amber-500/30 hover:border-amber-500/70 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer min-h-[180px] group"
                >
                  <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-400 block">+ Agregar Nuevo Taller</span>
                    <span className="text-[10px] text-slate-400">Subir logotipo, temario y asignación</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Curricular Subjects Table */}
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Materias Curriculares Oficiales NEM (Fases 3, 4, 5 y 6)
              </h4>

              <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Nombre de la Disciplina</th>
                      <th className="p-4">Nivel / Fase</th>
                      <th className="p-4">Clave Curricular</th>
                      <th className="p-4 text-center">Tipo</th>
                      <th className="p-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {subjectsList.filter(s => !s.is_elective && s.category !== 'optativa').map(sub => (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white text-sm">{sub.name}</td>
                        <td className="p-4 font-semibold text-slate-300 uppercase">{sub.level_grade_id}</td>
                        <td className="p-4 font-mono text-slate-400">{sub.sep_code || 'NEM-SEP'}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            Curricular Oficial
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-emerald-400 font-bold text-xs">✔ Vigente</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INSTITUTIONAL CONFIG & SECURITY */}
        {activeTab === 'config' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-black text-white">Ficha Institucional · UP Juan Jacobo Rosseau</h3>
                <p className="text-xs text-slate-400 mt-0.5">Parámetros corporativos y claves de centro de trabajo oficiales.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Nombre Institucional</label>
                  <input
                    type="text"
                    disabled
                    value={schoolSettings.name}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Clave de Centro de Trabajo (CCT)</label>
                  <input
                    type="text"
                    disabled
                    value={schoolSettings.cct}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 font-mono text-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Dirección Corporativa</label>
                  <input
                    type="text"
                    disabled
                    value={schoolSettings.address}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Teléfono Institucional</label>
                  <input
                    type="text"
                    disabled
                    value={schoolSettings.phone}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 font-mono text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Políticas de Seguridad & Contraseñas
              </h4>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>Generación aleatoria de contraseñas de 6 dígitos alfanuméricos (`[A-Za-z0-9]`).</li>
                <li>Capacidad de cambio directo de contraseñas por el Super Usuario en tiempo real.</li>
                <li>Bloqueo y cancelación instantánea de credenciales para docentes y estudiantes.</li>
                <li>Los profesores registrados disponen únicamente de acceso al panel docente (`/teacher`).</li>
                <li>Sincronización en segundo plano con la base de datos central en Supabase.</li>
              </ul>
            </div>
          </div>
        )}

      </main>

      {/* MODAL PRINCIPAL: INFORMACIÓN DEL CURSO / TALLER ACADÉMICO (TEMARIO + MULTI-GRUPO + ALUMNOS) */}
      {selectedWorkshopDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Header del Curso / Taller */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-start gap-3.5">
                {selectedWorkshopDetail.image_url ? (
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedWorkshopDetail.image_url} alt={selectedWorkshopDetail.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="h-7 w-7" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-white">{selectedWorkshopDetail.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedWorkshopDetail.workshop_category || 'TALLER OPTATIVO'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10">
                      Clave: {selectedWorkshopDetail.sep_code || 'OPT-2026'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    {selectedWorkshopDetail.instructor_name && (
                      <span className="text-slate-300 font-semibold flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-500" /> Instructor: {selectedWorkshopDetail.instructor_name}
                      </span>
                    )}
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" /> {selectedWorkshopDetail.campus_name || 'Todos los Planteles'}
                    </span>
                    {selectedWorkshopDetail.schedule && (
                      <>
                        <span>·</span>
                        <span className="text-indigo-300 font-mono">🕒 {selectedWorkshopDetail.schedule}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedWorkshopDetail(null)} 
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Descripción del Taller */}
            {selectedWorkshopDetail.description && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-400 block mb-0.5">Objetivos y Enfoque Pedagógico:</strong>
                {selectedWorkshopDetail.description}
              </div>
            )}

            {/* Tabs del Detalle */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setWorkshopDetailTab('syllabus')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  workshopDetailTab === 'syllabus'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <FileText className="h-4 w-4" /> 1. Temario & Programa de Estudio
              </button>

              <button
                onClick={() => setWorkshopDetailTab('annual_plans')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  workshopDetailTab === 'annual_plans'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Calendar className="h-4 w-4" /> 2. Planeación Anual por Grupo (Multi-Grupo)
              </button>

              <button
                onClick={() => setWorkshopDetailTab('students')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  workshopDetailTab === 'students'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <GraduationCap className="h-4 w-4" /> 3. Alumnos Inscritos del Grupo
              </button>
            </div>

            {/* CONTENIDO TAB 1: TEMARIO Y PROGRAMA DE ESTUDIO */}
            {workshopDetailTab === 'syllabus' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-white">Estructura Modular & Temario del Taller</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Módulos cronometrados, semanas de ejecución y entregables oficiales.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedWorkshopDetail.syllabus_url && (
                      <a
                        href={selectedWorkshopDetail.syllabus_url}
                        download={selectedWorkshopDetail.syllabus_filename || `${selectedWorkshopDetail.name}_Temario.pdf`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md transition-all"
                      >
                        <FileDown className="h-4 w-4" /> Descargar Archivo ({selectedWorkshopDetail.syllabus_filename || 'PDF'})
                      </a>
                    )}
                    <button
                      onClick={() => setShowAddTopicModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> + Agregar Bloque Temático
                    </button>
                  </div>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {(selectedWorkshopDetail.syllabus_topics || [
                    { block: 'Bloque 1', title: 'Fundamentos e Iniciación Práctica', weeks: '4 Semanas', description: 'Conceptos base y diagnóstico motriz/analítico de inicio.', deliverable: 'Bitácora diagnóstica' },
                    { block: 'Bloque 2', title: 'Desarrollo de Técnicas Especializadas', weeks: '6 Semanas', description: 'Ejercicios secuenciales y retos estructurados.', deliverable: 'Evaluación intermedia' },
                    { block: 'Bloque 3', title: 'Proyectos y Aplicación en Escenario Real', weeks: '6 Semanas', description: 'Diseño de estrategias y trabajo colaborativo.', deliverable: 'Proyecto grupal' },
                    { block: 'Bloque 4', title: 'Exhibición Escolar y Cierre Anual', weeks: '4 Semanas', description: 'Presentación final y torneo de convivencia escolar.', deliverable: 'Demostración práctica comunitaria' }
                  ]).map((topic: SyllabusTopic, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2 hover:border-amber-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                          {topic.block}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">{topic.weeks}</span>
                      </div>
                      <h5 className="text-xs font-black text-white">{topic.title}</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{topic.description}</p>
                      {topic.deliverable && (
                        <div className="pt-2 border-t border-white/5 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3 shrink-0" /> Entregable: {topic.deliverable}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTENIDO TAB 2: PLANEACIÓN ANUAL POR GRUPO (MULTI-GRUPO) */}
            {workshopDetailTab === 'annual_plans' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
                  💡 <strong>Materia Optativa Multi-Grupo:</strong> Este taller se imparte a distintos grupos en varios planteles. Selecciona un grupo para consultar o actualizar su planeación anual específica adaptada a su grado académico.
                </div>

                {/* Group Selector Strip */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">Selecciona el Grupo Escolar:</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {availableGroupsForWorkshop.map(grp => (
                      <button
                        key={grp.id}
                        onClick={() => setSelectedGroupForPlan(grp.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          selectedGroupForPlan === grp.id
                            ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                            : 'bg-slate-950 text-slate-300 hover:bg-white/5 border border-white/10'
                        }`}
                      >
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{grp.campus_name} · {grp.grade} {grp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Group Annual Plan Card */}
                {activeGroupPlan && (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">{activeGroupPlan.plan_title}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            Vigente 2026
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Plantel: <strong className="text-slate-300">{activeGroupPlan.campus_name}</strong> · Grado: <strong className="text-slate-300">{activeGroupPlan.grade} {activeGroupPlan.group_name}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setAnnualPlanForm({
                            plan_title: activeGroupPlan.plan_title,
                            project_title: activeGroupPlan.project_title || '',
                            pda_focus: activeGroupPlan.pda_focus || '',
                            term_1: activeGroupPlan.term_1,
                            term_2: activeGroupPlan.term_2,
                            term_3: activeGroupPlan.term_3
                          });
                          setShowEditAnnualPlanModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md cursor-pointer transition-all hover:scale-102"
                      >
                        <Edit3 className="h-4 w-4" /> Editar / Recibir Planeación Anual
                      </button>
                    </div>

                    {/* PDA and Project Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {activeGroupPlan.pda_focus && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block">Eje Formativo / PDA Oficial:</span>
                          <p className="text-slate-200">{activeGroupPlan.pda_focus}</p>
                        </div>
                      )}
                      {activeGroupPlan.project_title && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 block">Proyecto Comunitario del Grupo:</span>
                          <p className="text-slate-200">{activeGroupPlan.project_title}</p>
                        </div>
                      )}
                    </div>

                    {/* Term 1, 2, 3 Breakdown */}
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                        <span className="text-xs font-black text-amber-400 block">📅 Trimestre 1 (Diagnóstico y Fundamentación)</span>
                        <p className="text-slate-300 leading-relaxed">{activeGroupPlan.term_1}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                        <span className="text-xs font-black text-indigo-400 block">📅 Trimestre 2 (Desarrollo y Proyectos Intermedios)</span>
                        <p className="text-slate-300 leading-relaxed">{activeGroupPlan.term_2}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                        <span className="text-xs font-black text-emerald-400 block">📅 Trimestre 3 (Evaluación Formativa y Cierre)</span>
                        <p className="text-slate-300 leading-relaxed">{activeGroupPlan.term_3}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONTENIDO TAB 3: ALUMNOS INSCRITOS EN ESTE GRUPO */}
            {workshopDetailTab === 'students' && (
              <div className="space-y-4">
                {/* Group Selector for Students */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Grupo:</span>
                    {availableGroupsForWorkshop.map(grp => (
                      <button
                        key={grp.id}
                        onClick={() => setSelectedGroupForPlan(grp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedGroupForPlan === grp.id
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-950 text-slate-400 hover:bg-white/5 border border-white/10'
                        }`}
                      >
                        {grp.campus_name} · {grp.grade} {grp.name}
                      </button>
                    ))}
                  </div>

                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={workshopStudentSearch}
                      onChange={(e) => setWorkshopStudentSearch(e.target.value)}
                      placeholder="Buscar alumno en grupo..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Enrolled Students Table */}
                <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-3 bg-slate-900 border-b border-white/5 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">
                      Alumnos inscritos en este taller ({studentsInSelectedWorkshopGroup.length})
                    </span>
                    <span className="text-[11px] text-slate-400">Sincronizado con base de datos de ISkool</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Estudiante</th>
                          <th className="p-3.5">CURP</th>
                          <th className="p-3.5">Plantel & Grado</th>
                          <th className="p-3.5 text-center">Nivel / XP</th>
                          <th className="p-3.5 text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-200">
                        {studentsInSelectedWorkshopGroup.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-slate-500 text-xs">
                              No hay alumnos registrados para este grupo específico con los filtros actuales.
                            </td>
                          </tr>
                        ) : (
                          studentsInSelectedWorkshopGroup.map(st => (
                            <tr key={st.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                  {st.first_name.charAt(0)}{st.last_name_1.charAt(0)}
                                </div>
                                <div>
                                  <div>{st.first_name} {st.second_name || ''} {st.last_name_1} {st.last_name_2 || ''}</div>
                                  <div className="text-[10px] text-slate-500 font-normal">{st.email}</div>
                                </div>
                              </td>
                              <td className="p-3.5 font-mono text-slate-400 text-[11px]">{st.curp || 'SIN-CURP'}</td>
                              <td className="p-3.5 text-slate-300 font-semibold">
                                {st.campus_name} · {st.grade}
                              </td>
                              <td className="p-3.5 text-center font-mono">
                                <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                                  Nivel {typeof st.level === 'number' ? st.level : 1} ({(st as any).total_xp || 150} XP)
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <span className="text-emerald-400 font-bold text-xs">✔ Inscrito</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedWorkshopDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ALTA INDIVIDUAL DE ALUMNO */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">Alta Individual de Alumno</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕ Cerrar</button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Nombre(s) *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.first_name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, first_name: e.target.value })}
                    placeholder="Ej. Rodrigo"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Segundo Nombre</label>
                  <input
                    type="text"
                    value={newStudentForm.second_name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, second_name: e.target.value })}
                    placeholder="Ej. Andrés"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Primer Apellido *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.last_name_1}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, last_name_1: e.target.value })}
                    placeholder="Ej. Morales"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Segundo Apellido</label>
                  <input
                    type="text"
                    value={newStudentForm.last_name_2}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, last_name_2: e.target.value })}
                    placeholder="Ej. Ríos"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Plantel *</label>
                  <select
                    value={newStudentForm.campus_name}
                    onChange={(e) => setNewStudentForm({ 
                      ...newStudentForm, 
                      campus_name: e.target.value,
                      level: e.target.value.includes('Secundaria') ? 'secundaria' : 'primaria'
                    })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  >
                    {campusesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Grado Escolar *</label>
                  <select
                    value={newStudentForm.grade}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, grade: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="1º">1º de Grado</option>
                    <option value="2º">2º de Grado</option>
                    <option value="3º">3º de Grado</option>
                    <option value="4º">4º de Grado</option>
                    <option value="5º">5º de Grado</option>
                    <option value="6º">6º de Grado</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
                ℹ️ Se generará automáticamente una <strong>contraseña de 6 caracteres aleatorios</strong> y se creará todo su perfil y stats en el sistema.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg cursor-pointer"
                >
                  Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CARGA RÁPIDA (EXCEL / CSV / PEGAR LISTA) */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-indigo-400" /> Carga Rápida de Alumnos (Excel / CSV)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Sube tu archivo de Excel o pega la lista de alumnos directamente.</p>
              </div>
              <button onClick={() => setShowBulkUploadModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕ Cerrar</button>
            </div>

            {/* Opciones de Carga */}
            <div className="space-y-3">
              {/* Opción 1: Archivo */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-white/20 text-center space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.csv,.txt"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  📁 Seleccionar Archivo Excel (.xlsx / .csv)
                </button>
                <p className="text-[11px] text-slate-500">O arrastra y suelta tu archivo aquí</p>
              </div>

              {/* Opción 2: Pegado de Texto */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">O pega el texto copiado de Excel:</label>
                <textarea
                  rows={4}
                  value={bulkTextInput}
                  onChange={(e) => {
                    setBulkTextInput(e.target.value);
                    parseBulkText(e.target.value);
                  }}
                  placeholder="Ejemplo:&#10;Mateo, Ortiz, Medina, Primaria Torres, 4º&#10;Valentina, Hernández, Silva, Primaria Jardines, 1º&#10;Diego, Jiménez, Ríos, Secundaria Torres, 2º"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Vista Previa de Alumnos Detectados */}
              {bulkPreviewList.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">✔ {bulkPreviewList.length} Alumnos detectados para importar:</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-slate-950 divide-y divide-white/5 text-xs">
                    {bulkPreviewList.map((st, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{st.first_name} {st.last_name_1} {st.last_name_2}</span>
                        <span className="text-slate-400">{st.campus_name} · {st.grade} Grado</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resultados Generados con Contraseñas */}
              {bulkGeneratedResults && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">🎉 ¡{bulkGeneratedResults.length} Alumnos importados con éxito!</span>
                    <button
                      onClick={exportCredentialsCSV}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Descargar Credenciales (CSV)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowBulkUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Cerrar
              </button>
              {!bulkGeneratedResults && (
                <button
                  type="button"
                  onClick={handleExecuteBulkUpload}
                  disabled={bulkPreviewList.length === 0}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-black shadow-lg cursor-pointer"
                >
                  Procesar e Importar {bulkPreviewList.length} Alumnos
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CAMBIO DIRECTO DE CONTRASEÑA */}
      {showPasswordModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Cambiar Contraseña</h3>
                <p className="text-xs text-slate-400 mt-0.5">{showPasswordModal.userName}</p>
              </div>
              <button 
                onClick={() => setShowPasswordModal({ isOpen: false, userId: '', userName: '', role: 'student' })} 
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Contraseña Actual:</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 font-mono text-amber-400 font-bold flex items-center justify-between">
                  <span>{showPasswordModal.currentPassword || '---'}</span>
                  <button
                    onClick={() => copyToClipboard(showPasswordModal.currentPassword || '', 'modal-pwd')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleDirectPasswordChange()}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
                >
                  <RefreshCw className="h-4 w-4" /> Generar Nueva Contraseña Aleatoria (6 Dígitos)
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowPasswordModal({ isOpen: false, userId: '', userName: '', role: 'student' })}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ALTA DE PROFESOR (ACCESO EXCLUSIVO DOCENTE) */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Registrar Nuevo Profesor</h3>
                <p className="text-xs text-slate-400">El docente tendrá acceso exclusivo al Portal Docente (/teacher).</p>
              </div>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕ Cerrar</button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Nombre(s) *</label>
                  <input
                    type="text"
                    required
                    value={newTeacherForm.first_name}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, first_name: e.target.value })}
                    placeholder="Ej. Laura"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={newTeacherForm.last_name}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, last_name: e.target.value })}
                    placeholder="Ej. González"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Plantel Principal *</label>
                <select
                  value={newTeacherForm.campus_name}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, campus_name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                >
                  <option value="Primaria Jardines">Primaria Jardines</option>
                  <option value="Primaria Torres">Primaria Torres</option>
                  <option value="Secundaria Torres">Secundaria Torres</option>
                  <option value="Todos los Planteles">Todos los Planteles</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Materias Asignadas (separadas por coma)</label>
                <input
                  type="text"
                  value={newTeacherForm.assigned_subjects}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, assigned_subjects: e.target.value })}
                  placeholder="Ej. Matemáticas, Robótica"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                🔒 Al dar de alta este docente, podrá ingresar con su correo y contraseña de 6 dígitos con permisos restringidos exclusivamente a la vista de profesor.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg cursor-pointer"
                >
                  Registrar Profesor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ALTA DE NUEVO TALLER ACADÉMICO / OPTATIVA */}
      {showAddWorkshopModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Alta de Nuevo Taller Académico</h3>
                  <p className="text-xs text-slate-400">Configura la información oficial, horario, temario y logotipo.</p>
                </div>
              </div>
              <button onClick={() => setShowAddWorkshopModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕ Cerrar</button>
            </div>

            <form onSubmit={handleCreateWorkshop} className="space-y-3.5 text-xs">
              
              {/* Nombre y Clave SEP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Nombre del Taller Académico *</label>
                  <input
                    type="text"
                    required
                    value={newWorkshopForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewWorkshopForm(prev => ({
                        ...prev,
                        name: val,
                        sep_code: prev.sep_code || (val.length >= 3 ? `OPT-${val.substring(0, 3).toUpperCase()}` : '')
                      }));
                    }}
                    placeholder="Ej. Ajedrez Estratégico, Programación con Python..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Clave Oficial / SEP</label>
                  <input
                    type="text"
                    value={newWorkshopForm.sep_code}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, sep_code: e.target.value.toUpperCase() })}
                    placeholder="Ej. OPT-AJE"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-amber-400 font-mono font-bold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Categoría y Plantel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Categoría del Taller *</label>
                  <select
                    value={newWorkshopForm.workshop_category}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, workshop_category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="tecnologico">🤖 Tecnológico (Robótica, Programación, IA)</option>
                    <option value="deportivo">🏃‍♂️ Deportivo (Basquetbol, Fútbol, Atletismo)</option>
                    <option value="artistico">🎨 Artístico (Música, Danza, Pintura, Teatro)</option>
                    <option value="cientifico">🔬 Científico (Astronomía, Experimentos, Ecología)</option>
                    <option value="academico">♟️ Académico / Lógica (Ajedrez, Debate, Idiomas)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Plantel(es) donde se imparte *</label>
                  <select
                    value={newWorkshopForm.campus_name}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, campus_name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Todos los Planteles">🏢 Todos los Planteles</option>
                    <option value="Primaria Jardines">Primaria Jardines</option>
                    <option value="Primaria Torres">Primaria Torres</option>
                    <option value="Secundaria Torres">Secundaria Torres</option>
                  </select>
                </div>
              </div>

              {/* Instructor y Horario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Profesor / Instructor Responsable</label>
                  <select
                    value={newWorkshopForm.instructor_name}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, instructor_name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {teachersList.map(t => (
                      <option key={t.id} value={`${t.first_name} ${t.last_name}`}>
                        {t.first_name} {t.last_name} ({t.campus_name || 'General'})
                      </option>
                    ))}
                    <option value="Instructor Externo / Especialista">Instructor Externo / Especialista</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Horario y Días</label>
                  <input
                    type="text"
                    value={newWorkshopForm.schedule}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, schedule: e.target.value })}
                    placeholder="Ej. Martes y Jueves 16:00 - 17:30"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Objetivos Pedagógicos y Descripción</label>
                <textarea
                  rows={2}
                  value={newWorkshopForm.description}
                  onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, description: e.target.value })}
                  placeholder="Describe las competencias que desarrollarán los alumnos en este taller..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* ARCHIVOS: Portada / Logotipo y Temario PDF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* 1. Subida de Imagen/Portada */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-dashed border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" /> Portada / Logotipo
                    </span>
                    {newWorkshopForm.image_url && (
                      <span className="text-[10px] text-emerald-400 font-semibold">✔ Imagen lista</span>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={workshopImageRef}
                    accept="image/*"
                    onChange={handleWorkshopImageUpload}
                    className="hidden"
                  />

                  {newWorkshopForm.image_url ? (
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={newWorkshopForm.image_url} alt="Preview" className="h-10 w-10 rounded-lg object-cover border border-amber-500/30" />
                      <button
                        type="button"
                        onClick={() => setNewWorkshopForm(prev => ({ ...prev, image_url: '' }))}
                        className="text-[10px] text-red-400 hover:underline cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => workshopImageRef.current?.click()}
                      className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                    >
                      🖼 Seleccionar Imagen (PNG/JPG)
                    </button>
                  )}
                </div>

                {/* 2. Subida de Temario / Programa PDF */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-dashed border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                      <FileDown className="h-3.5 w-3.5" /> Temario / Programa (PDF)
                    </span>
                    {newWorkshopForm.syllabus_filename && (
                      <span className="text-[10px] text-emerald-400 font-semibold">✔ Documento listo</span>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={workshopSyllabusRef}
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleWorkshopSyllabusUpload}
                    className="hidden"
                  />

                  {newWorkshopForm.syllabus_filename ? (
                    <div className="flex items-center justify-between gap-1 bg-white/5 p-1.5 rounded-lg">
                      <span className="text-[10px] text-slate-300 truncate max-w-[130px] font-mono">
                        {newWorkshopForm.syllabus_filename}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewWorkshopForm(prev => ({ ...prev, syllabus_url: '', syllabus_filename: '' }))}
                        className="text-[10px] text-red-400 hover:underline cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => workshopSyllabusRef.current?.click()}
                      className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                    >
                      📄 Subir Archivo PDF / Doc
                    </button>
                  )}
                </div>

              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddWorkshopModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 cursor-pointer transition-all hover:scale-102"
                >
                  Guardar y Publicar Taller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EDITAR / RECIBIR PLANEACIÓN ANUAL DE GRUPO */}
      {showEditAnnualPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Planeación Anual Oficial del Grupo</h3>
                <p className="text-xs text-amber-400">{selectedWorkshopDetail?.name} · Grupo {selectedGroupForPlan}</p>
              </div>
              <button onClick={() => setShowEditAnnualPlanModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕ Cerrar</button>
            </div>

            <form onSubmit={handleSaveAnnualPlan} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Título de la Planeación Anual</label>
                <input
                  type="text"
                  required
                  value={annualPlanForm.plan_title}
                  onChange={(e) => setAnnualPlanForm({ ...annualPlanForm, plan_title: e.target.value })}
                  placeholder="Ej. Planeación Anual 2026 - Robótica 4º Primaria Jardines"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white font-bold outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Eje Formativo / PDA Oficial de la SEP</label>
                <input
                  type="text"
                  value={annualPlanForm.pda_focus}
                  onChange={(e) => setAnnualPlanForm({ ...annualPlanForm, pda_focus: e.target.value })}
                  placeholder="Ej. Pensamiento analítico y resolución colaborativa..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Proyecto Comunitario Integrador</label>
                <input
                  type="text"
                  value={annualPlanForm.project_title}
                  onChange={(e) => setAnnualPlanForm({ ...annualPlanForm, project_title: e.target.value })}
                  placeholder="Ej. Eco-Robot Comunitario para el patio escolar"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Trimestre 1 (Objetivos & Actividades)</label>
                <textarea
                  rows={2}
                  value={annualPlanForm.term_1}
                  onChange={(e) => setAnnualPlanForm({ ...annualPlanForm, term_1: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Trimestre 2 (Objetivos & Actividades)</label>
                <textarea
                  rows={2}
                  value={annualPlanForm.term_2}
                  onChange={(e) => setAnnualPlanForm({ ...annualPlanForm, term_2: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Trimestre 3 (Objetivos & Actividades)</label>
                <textarea
                  rows={2}
                  value={annualPlanForm.term_3}
                  onChange={(e) => setAnnualPlanForm({ ...annualPlanForm, term_3: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditAnnualPlanModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  Guardar Planeación Anual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: AGREGAR BLOQUE TEMÁTICO AL TEMARIO */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">Agregar Bloque al Temario</h3>
              <button onClick={() => setShowAddTopicModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕ Cerrar</button>
            </div>

            <form onSubmit={handleAddSyllabusTopic} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Identificador de Bloque</label>
                  <input
                    type="text"
                    required
                    value={newTopicForm.block}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, block: e.target.value })}
                    placeholder="Ej. Bloque 5"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white font-bold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Duración (Semanas)</label>
                  <input
                    type="text"
                    required
                    value={newTopicForm.weeks}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, weeks: e.target.value })}
                    placeholder="Ej. 4 Semanas"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Título del Módulo o Tema *</label>
                <input
                  type="text"
                  required
                  value={newTopicForm.title}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                  placeholder="Ej. Aplicaciones Avanzadas y Torneo Escolar"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white font-bold outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Descripción de Contenidos</label>
                <textarea
                  rows={2}
                  value={newTopicForm.description}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, description: e.target.value })}
                  placeholder="Temas que se impartirán en este bloque..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Entregable Tangible / Evaluación</label>
                <input
                  type="text"
                  value={newTopicForm.deliverable}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, deliverable: e.target.value })}
                  placeholder="Ej. Rúbrica y prototipo final"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  Guardar Bloque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: ALTA DE MATERIA CURRICULAR SIMPLE */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">Agregar Materia Curricular Oficial</h3>
              <button onClick={() => setShowAddSubjectModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕ Cerrar</button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Nombre de la Disciplina *</label>
                <input
                  type="text"
                  required
                  value={newSubjectForm.name}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, name: e.target.value })}
                  placeholder="Ej. Lengua Extranjera Inglés"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Clave Curricular</label>
                <input
                  type="text"
                  value={newSubjectForm.sep_code}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, sep_code: e.target.value })}
                  placeholder="Ej. NEM-ING"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg cursor-pointer"
                >
                  Guardar Materia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
