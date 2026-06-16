'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt' | 'es';

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // NAV
    'nav.dashboard': 'Dashboard',
    'nav.learn': 'Learn',
    'nav.upload': 'Upload',
    'nav.history': 'History',
    'nav.merge': '⋈ Merge',

    // HOME
    'home.hero.title': 'Intelligent Dataset Diagnosis & ETL',
    'home.hero.subtitle': 'Upload your CSV or Excel files, instantly evaluate data quality, and apply visual transformations without writing a single line of code.',
    'home.hero.cta': 'Get Started',
    'home.recent.title': 'Continue your session',
    'home.recent.viewAll': 'View all',
    'home.recent.rows': 'rows',
    'home.recent.analyze': 'Analyze',
    'home.recent.pipeline': 'Pipeline',
    'home.feat.upload.title': 'Universal Upload',
    'home.feat.upload.desc': 'Supports local parsing for CSV and XLSX files, ensuring your data never leaves your browser until you choose to export.',
    'home.feat.quality.title': 'Quality Scoring',
    'home.feat.quality.desc': 'Get an instant health score from 0-100 based on missing values, duplicates, outliers, and type inconsistencies.',
    'home.feat.pipeline.title': 'Visual Pipeline',
    'home.feat.pipeline.desc': 'Build data transformation pipelines visually. Cleanse, transform, and normalize data in real-time before exporting.',

    // UPLOAD
    'upload.title': 'Upload Dataset',
    'upload.subtitle': 'Securely parse your CSV or XLSX files locally in your browser.',
    'upload.loaded': 'Dataset loaded successfully',
    'upload.another': 'Upload another file',
    'upload.analyze': 'Run Quality Analysis',
    'upload.saving': 'Saving...',

    // HISTORY
    'history.title': 'Your Datasets',
    'history.subtitle': 'Resume your previous sessions securely stored in your browser.',
    'history.newUpload': 'New Upload',
    'history.loading': 'Loading...',
    'history.empty.title': 'No datasets found',
    'history.empty.desc': "You haven't uploaded any datasets yet. Upload a CSV or Excel file to get started.",
    'history.empty.cta': 'Upload Dataset',
    'history.rows': 'rows',
    'history.cols': 'cols',
    'history.delete.confirm': 'Are you sure you want to delete this dataset?',
    'history.btn.analyzer': 'Analyzer',
    'history.btn.pipeline': 'Pipeline',
    'history.btn.merge': 'Merge',

    // ANALYZER
    'analyzer.title': 'Data Quality Analysis',
    'analyzer.subtitle': 'Report for:',
    'analyzer.loading.title': 'Analyzing Data Quality...',
    'analyzer.loading.subtitle': 'Scanning for nulls, duplicates, and outliers',
    'analyzer.back': 'Back',
    'analyzer.buildPipeline': 'Build Pipeline',
    'analyzer.columnProfiles': 'Column Profiles',

    // PIPELINE
    'pipeline.title': 'Visual ETL Pipeline',
    'pipeline.subtitle': 'Apply non-destructive transformations to',
    'pipeline.back': 'Back',
    'pipeline.saveHistory': 'Save to History',
    'pipeline.saving': 'Saving...',
    'pipeline.originalRows': 'Original Rows',
    'pipeline.rowsAfter': 'Rows After Pipeline',
    'pipeline.columns': 'Columns',
    'pipeline.processing': 'Processing...',
    'pipeline.prompt.name': 'How would you like to name this cleaned dataset?',
    'pipeline.saved.msg': 'Dataset "{name}" saved to History! What would you like to do?',
    'pipeline.choice.stay': 'Continue Editing',
    'pipeline.choice.history': 'Go to History',
    'pipeline.choice.merge': 'Go to Merge ⋈',

    // LEARN
    'learn.title': 'DataQ Platform Guide',
    'learn.subtitle': 'A local-first, zero-backend ETL platform for cleaning, transforming, and merging datasets directly in your browser.',
    'learn.security.title': '100% Local & Private',
    'learn.security.desc': 'DataQ runs entirely inside your browser using Web Workers and IndexedDB. Your data never leaves your computer. No servers, no tracking, pure performance.',
    'learn.step1.title': '1. Upload Your Data',
    'learn.step1.desc': 'Start by navigating to the Upload page. You can drag and drop your CSV or Excel files. We use multi-threaded web workers to parse massive datasets instantly without freezing your browser.',
    'learn.step2.title': '2. Analyze & Auto-Fix',
    'learn.step2.desc': 'After uploading, you arrive at the Analyzer. The system automatically scans every column for issues like null values, duplicates, outliers, and incorrect data types.',
    'learn.step2.tip': 'Pro Tip: Look for the green "Fix in Pipeline" buttons on the column cards. Clicking these will automatically generate a transformation step to fix the detected issue!',
    'learn.step3.title': '3. Build the ETL Pipeline',
    'learn.step3.desc': 'Click "Build Pipeline" to enter the drag-and-drop workflow editor. Here you can stack transformations sequentially to clean your data.',
    'learn.step4.title': '4. Save to History & Recipes',
    'learn.step4.desc': 'When your data is clean, you have options: Save to History, create Recipes, or Export directly.',
    'learn.step5.title': '5. Merge Datasets',
    'learn.step5.desc': 'Combine two datasets from your History visually. Supports Inner, Left, Right, Full Outer, and Stack operations.',
    'learn.start': 'Get Started',
  },
  pt: {
    // NAV
    'nav.dashboard': 'Início',
    'nav.learn': 'Aprender',
    'nav.upload': 'Enviar',
    'nav.history': 'Histórico',
    'nav.merge': '⋈ Mesclar',

    // HOME
    'home.hero.title': 'Diagnóstico e ETL Inteligente de Datasets',
    'home.hero.subtitle': 'Envie seus arquivos CSV ou Excel, avalie a qualidade dos dados instantaneamente e aplique transformações visuais sem escrever uma linha de código.',
    'home.hero.cta': 'Começar Agora',
    'home.recent.title': 'Continuar sessão',
    'home.recent.viewAll': 'Ver todos',
    'home.recent.rows': 'linhas',
    'home.recent.analyze': 'Analisar',
    'home.recent.pipeline': 'Pipeline',
    'home.feat.upload.title': 'Upload Universal',
    'home.feat.upload.desc': 'Suporte para análise local de CSV e XLSX, garantindo que seus dados nunca saiam do seu navegador até você escolher exportar.',
    'home.feat.quality.title': 'Score de Qualidade',
    'home.feat.quality.desc': 'Obtenha uma pontuação de saúde de 0 a 100 baseada em valores nulos, duplicatas, outliers e inconsistências de tipo.',
    'home.feat.pipeline.title': 'Pipeline Visual',
    'home.feat.pipeline.desc': 'Construa pipelines de transformação de dados visualmente. Limpe, transforme e normalize dados em tempo real antes de exportar.',

    // UPLOAD
    'upload.title': 'Enviar Dataset',
    'upload.subtitle': 'Analise seus arquivos CSV ou XLSX com segurança, localmente no seu navegador.',
    'upload.loaded': 'Dataset carregado com sucesso',
    'upload.another': 'Enviar outro arquivo',
    'upload.analyze': 'Executar Análise de Qualidade',
    'upload.saving': 'Salvando...',

    // HISTORY
    'history.title': 'Seus Datasets',
    'history.subtitle': 'Retome suas sessões anteriores armazenadas com segurança no seu navegador.',
    'history.newUpload': 'Novo Envio',
    'history.loading': 'Carregando...',
    'history.empty.title': 'Nenhum dataset encontrado',
    'history.empty.desc': 'Você ainda não enviou nenhum dataset. Envie um arquivo CSV ou Excel para começar.',
    'history.empty.cta': 'Enviar Dataset',
    'history.rows': 'linhas',
    'history.cols': 'colunas',
    'history.delete.confirm': 'Tem certeza que deseja excluir este dataset?',
    'history.btn.analyzer': 'Analisar',
    'history.btn.pipeline': 'Pipeline',
    'history.btn.merge': 'Mesclar',

    // ANALYZER
    'analyzer.title': 'Análise de Qualidade dos Dados',
    'analyzer.subtitle': 'Relatório para:',
    'analyzer.loading.title': 'Analisando Qualidade dos Dados...',
    'analyzer.loading.subtitle': 'Verificando nulos, duplicatas e outliers',
    'analyzer.back': 'Voltar',
    'analyzer.buildPipeline': 'Construir Pipeline',
    'analyzer.columnProfiles': 'Perfis de Colunas',

    // PIPELINE
    'pipeline.title': 'Pipeline ETL Visual',
    'pipeline.subtitle': 'Aplicar transformações não-destrutivas em',
    'pipeline.back': 'Voltar',
    'pipeline.saveHistory': 'Salvar no Histórico',
    'pipeline.saving': 'Salvando...',
    'pipeline.originalRows': 'Linhas Originais',
    'pipeline.rowsAfter': 'Linhas Após Pipeline',
    'pipeline.columns': 'Colunas',
    'pipeline.processing': 'Processando...',
    'pipeline.prompt.name': 'Como deseja nomear este dataset limpo?',
    'pipeline.saved.msg': 'Dataset "{name}" salvo no Histórico! O que deseja fazer agora?',
    'pipeline.choice.stay': 'Continuar Editando',
    'pipeline.choice.history': 'Ir ao Histórico',
    'pipeline.choice.merge': 'Ir para Mesclar ⋈',

    // LEARN
    'learn.title': 'Guia da Plataforma DataQ',
    'learn.subtitle': 'Uma plataforma ETL local, sem backend, para limpar, transformar e mesclar dados direto no seu navegador.',
    'learn.security.title': '100% Local e Privado',
    'learn.security.desc': 'O DataQ roda inteiramente no seu navegador usando Web Workers e IndexedDB. Seus dados nunca saem do seu computador. Sem servidores, sem rastreamento, pura performance.',
    'learn.step1.title': '1. Envie seus Dados',
    'learn.step1.desc': 'Comece navegando até a página de Envio. Arraste seus arquivos CSV ou Excel. Usamos web workers para processar dados massivos sem travar seu navegador.',
    'learn.step2.title': '2. Análise e Correção Automática',
    'learn.step2.desc': 'Após o envio, você chega ao Analisador. O sistema rastreia cada coluna em busca de problemas como nulos, duplicatas e outliers.',
    'learn.step2.tip': 'Dica: Procure pelos botões verdes "Corrigir no Pipeline". Eles geram passos automáticos de transformação para corrigir o problema!',
    'learn.step3.title': '3. Construa o Pipeline ETL',
    'learn.step3.desc': 'Clique em "Construir Pipeline" para entrar no editor visual. Aqui você empilha transformações sequenciais para limpar os dados.',
    'learn.step4.title': '4. Salve no Histórico e Crie Receitas',
    'learn.step4.desc': 'Quando os dados estiverem limpos, você pode: Salvar no Histórico, criar Receitas para uso futuro ou Exportar direto.',
    'learn.step5.title': '5. Mesclar Bases (Merge)',
    'learn.step5.desc': 'Combine duas bases do seu Histórico visualmente. Suporta operações Inner, Left, Right, Full Outer e Empilhamento (Union).',
    'learn.start': 'Começar Agora',
  },
  es: {
    // NAV
    'nav.dashboard': 'Inicio',
    'nav.learn': 'Aprender',
    'nav.upload': 'Subir',
    'nav.history': 'Historial',
    'nav.merge': '⋈ Combinar',

    // HOME
    'home.hero.title': 'Diagnóstico y ETL Inteligente de Conjuntos de Datos',
    'home.hero.subtitle': 'Suba sus archivos CSV o Excel, evalúe la calidad de los datos al instante y aplique transformaciones visuales sin escribir ni una línea de código.',
    'home.hero.cta': 'Empezar Ahora',
    'home.recent.title': 'Continuar sesión',
    'home.recent.viewAll': 'Ver todos',
    'home.recent.rows': 'filas',
    'home.recent.analyze': 'Analizar',
    'home.recent.pipeline': 'Pipeline',
    'home.feat.upload.title': 'Carga Universal',
    'home.feat.upload.desc': 'Admite análisis local de archivos CSV y XLSX, asegurando que sus datos nunca salgan del navegador hasta que decida exportarlos.',
    'home.feat.quality.title': 'Puntuación de Calidad',
    'home.feat.quality.desc': 'Obtenga una puntuación de salud de 0 a 100 basada en valores faltantes, duplicados, valores atípicos e inconsistencias de tipo.',
    'home.feat.pipeline.title': 'Pipeline Visual',
    'home.feat.pipeline.desc': 'Construya pipelines de transformación de datos visualmente. Limpie, transforme y normalice datos en tiempo real antes de exportar.',

    // UPLOAD
    'upload.title': 'Subir Conjunto de Datos',
    'upload.subtitle': 'Analice sus archivos CSV o XLSX de forma segura y local en su navegador.',
    'upload.loaded': 'Conjunto de datos cargado exitosamente',
    'upload.another': 'Subir otro archivo',
    'upload.analyze': 'Ejecutar Análisis de Calidad',
    'upload.saving': 'Guardando...',

    // HISTORY
    'history.title': 'Sus Conjuntos de Datos',
    'history.subtitle': 'Retome sus sesiones anteriores almacenadas de forma segura en su navegador.',
    'history.newUpload': 'Nueva Carga',
    'history.loading': 'Cargando...',
    'history.empty.title': 'No se encontraron conjuntos de datos',
    'history.empty.desc': 'Aún no ha subido ningún conjunto de datos. Suba un archivo CSV o Excel para comenzar.',
    'history.empty.cta': 'Subir Conjunto de Datos',
    'history.rows': 'filas',
    'history.cols': 'cols',
    'history.delete.confirm': '¿Está seguro de que desea eliminar este conjunto de datos?',
    'history.btn.analyzer': 'Analizar',
    'history.btn.pipeline': 'Pipeline',
    'history.btn.merge': 'Combinar',

    // ANALYZER
    'analyzer.title': 'Análisis de Calidad de Datos',
    'analyzer.subtitle': 'Informe para:',
    'analyzer.loading.title': 'Analizando Calidad de Datos...',
    'analyzer.loading.subtitle': 'Escaneando nulos, duplicados y valores atípicos',
    'analyzer.back': 'Volver',
    'analyzer.buildPipeline': 'Construir Pipeline',
    'analyzer.columnProfiles': 'Perfiles de Columnas',

    // PIPELINE
    'pipeline.title': 'Pipeline ETL Visual',
    'pipeline.subtitle': 'Aplicar transformaciones no destructivas a',
    'pipeline.back': 'Volver',
    'pipeline.saveHistory': 'Guardar en Historial',
    'pipeline.saving': 'Guardando...',
    'pipeline.originalRows': 'Filas Originales',
    'pipeline.rowsAfter': 'Filas Después del Pipeline',
    'pipeline.columns': 'Columnas',
    'pipeline.processing': 'Procesando...',
    'pipeline.prompt.name': '¿Cómo desea nombrar este conjunto de datos limpio?',
    'pipeline.saved.msg': 'Conjunto "{name}" guardado en el Historial. ¿Qué desea hacer ahora?',
    'pipeline.choice.stay': 'Continuar Editando',
    'pipeline.choice.history': 'Ir al Historial',
    'pipeline.choice.merge': 'Ir a Combinar ⋈',

    // LEARN
    'learn.title': 'Guía de la Plataforma DataQ',
    'learn.subtitle': 'Una plataforma ETL local, sin backend, para limpiar, transformar y combinar datos directamente en su navegador.',
    'learn.security.title': '100% Local y Privado',
    'learn.security.desc': 'DataQ se ejecuta completamente en su navegador utilizando Web Workers e IndexedDB. Sus datos nunca salen de su computadora. Sin servidores, sin rastreo, puro rendimiento.',
    'learn.step1.title': '1. Sube tus Datos',
    'learn.step1.desc': 'Comience navegando a la página de Subida. Arrastre y suelte sus archivos CSV o Excel. Usamos web workers para procesar datos masivos sin bloquear su navegador.',
    'learn.step2.title': '2. Análisis y Corrección Automática',
    'learn.step2.desc': 'Después de subir los datos, llegará al Analizador. El sistema rastrea cada columna en busca de problemas como valores nulos, duplicados y atípicos.',
    'learn.step2.tip': 'Consejo: Busque los botones verdes "Corregir en Pipeline". ¡Estos generan pasos automáticos de transformación para solucionar el problema detectado!',
    'learn.step3.title': '3. Construya el Pipeline ETL',
    'learn.step3.desc': 'Haga clic en "Construir Pipeline" para entrar al editor visual. Aquí puede apilar transformaciones secuenciales para limpiar sus datos.',
    'learn.step4.title': '4. Guarde en el Historial y Recetas',
    'learn.step4.desc': 'Cuando sus datos estén limpios, puede: Guardar en el Historial, crear Recetas para el futuro o Exportar directamente.',
    'learn.step5.title': '5. Combinar Conjuntos (Merge)',
    'learn.step5.desc': 'Combine dos conjuntos de su Historial visualmente. Soporta operaciones Inner, Left, Right, Full Outer y Apilamiento (Union).',
    'learn.start': 'Empezar Ahora',
  },
};

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('dataq_lang') as Language;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'pt', 'es'].includes(browserLang)) {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dataq_lang', lang);
  };

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let str = translations[language]?.[key] ?? translations['en']?.[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
