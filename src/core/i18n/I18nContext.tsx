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

    // FILE UPLOADER
    'uploader.drag': 'Drag & drop your dataset here',
    'uploader.browse': 'or click to browse from your computer',
    'uploader.processing': 'Processing dataset...',
    'uploader.error.csv': 'Failed to parse CSV file.',
    'uploader.error.xlsx': 'Failed to parse Excel file.',
    'uploader.error.format': 'Unsupported file format. Please upload a CSV or XLSX file.',
    'uploader.error.read': 'Failed to read file.',
    'uploader.error.empty': 'The Excel file is empty.',
    'uploader.error.unexpected': 'An unexpected error occurred.',

    // PIPELINE BUILDER
    'pipeline.builder.title': 'Pipeline Builder',
    'pipeline.builder.recipes': 'Recipes',
    'pipeline.builder.closeRecipes': 'Close Recipes',
    'pipeline.builder.saveCurrent': 'Save Current',
    'pipeline.builder.export': 'Export',
    'pipeline.builder.import': 'Import',
    'pipeline.builder.savedRecipes': 'Saved Local Recipes:',
    'pipeline.builder.noRecipes': 'No saved recipes found.',
    'pipeline.builder.empty': 'Your pipeline is empty.',
    'pipeline.builder.emptyHint': 'Add a step below to start transforming data.',
    'pipeline.builder.selectTransform': 'Select Transformation',
    'pipeline.builder.addStep': 'Add Step',
    'pipeline.builder.cancel': 'Cancel',
    'pipeline.builder.prompt.name': 'Name this pipeline recipe:',
    'pipeline.builder.saved': 'Recipe saved locally!',
    'pipeline.builder.emptyExport': 'Pipeline is empty.',
    'pipeline.builder.invalidFile': 'Invalid template file.',
    'pipeline.builder.steps': 'steps',

    // TRANSFORMATION TYPES
    'transform.REMOVE_DUPLICATES.label': 'Remove Duplicates',
    'transform.REMOVE_DUPLICATES.desc': 'Deletes identical rows based on selected columns.',
    'transform.REMOVE_NULLS.label': 'Drop Nulls',
    'transform.REMOVE_NULLS.desc': 'Removes any row that contains empty/null values in the chosen column.',
    'transform.FILL_NULLS.label': 'Fill Nulls',
    'transform.FILL_NULLS.desc': 'Replaces empty/null values with a default text or number.',
    'transform.RENAME_COLUMN.label': 'Rename Column',
    'transform.RENAME_COLUMN.desc': 'Changes the title of an existing column.',
    'transform.REMOVE_COLUMN.label': 'Drop Column',
    'transform.REMOVE_COLUMN.desc': 'Deletes an entire column from the dataset.',
    'transform.CONVERT_TYPE.label': 'Convert Type',
    'transform.CONVERT_TYPE.desc': 'Changes the data format (e.g. Text to Number or Date).',
    'transform.NORMALIZE_TEXT.label': 'Normalize Text',
    'transform.NORMALIZE_TEXT.desc': 'Standardizes text (UPPERCASE, lowercase, Trim spaces).',
    'transform.FILTER_ROWS.label': 'Filter Rows',
    'transform.FILTER_ROWS.desc': 'Keeps or removes rows that match a specific condition.',
    'transform.SORT_DATA.label': 'Sort Data',
    'transform.SORT_DATA.desc': 'Orders rows alphabetically or numerically (A-Z, Z-A).',
    'transform.CALCULATED_COLUMN.label': 'Calculated Column',
    'transform.CALCULATED_COLUMN.desc': 'Creates a new column using math formulas (e.g. Qtd * Price).',
    'transform.MASK_DATA.label': 'Mask Data (LGPD)',
    'transform.MASK_DATA.desc': 'Anonymizes sensitive info like Emails or Documents.',
    'transform.GROUP_BY.label': 'Group By / Pivot',
    'transform.GROUP_BY.desc': 'Groups rows and calculates sums, averages, or counts.',
    'transform.FUZZY_DEDUPLICATE.label': 'Fuzzy Deduplicate',
    'transform.FUZZY_DEDUPLICATE.desc': 'Finds and merges similar texts with typos (e.g. "Jonh" and "John").',

    // MERGE PAGE
    'merge.title': 'Merge Datasets',
    'merge.subtitle': 'Combine two saved datasets using a SQL-style join. The merged result will be saved to your history and opened in the Analyzer.',

    // MERGE CONFIGURATOR
    'merge.loading': 'Loading datasets…',
    'merge.need2.title': 'At least 2 datasets required',
    'merge.need2.desc': 'Upload two or more datasets before merging.',
    'merge.need2.cta': '+ Upload New Dataset',
    'merge.step1.label': 'Select Datasets',
    'merge.step2.label': 'Configure Join',
    'merge.step3.label': 'Resolve Conflicts',
    'merge.step4.label': 'Download',
    'merge.step1.title': 'Select the two datasets to merge',
    'merge.step1.leftLabel': 'Left dataset (A)',
    'merge.step1.rightLabel': 'Right dataset (B)',
    'merge.step1.sameError': 'Please select two different datasets.',
    'merge.step1.rows': 'rows',
    'merge.step1.columns': 'columns',
    'merge.step2.title': 'Choose join type & key columns',
    'merge.step2.joinType': 'Join Type',
    'merge.step2.leftKey': 'Left key column',
    'merge.step2.rightKey': 'Right key column',
    'merge.step3.title': 'Resolve Column Conflicts',
    'merge.step3.noConflicts': 'No conflicting column names detected.',
    'merge.step3.conflicts': 'The following columns exist in both datasets:',
    'merge.step3.suffix': 'Add suffix',
    'merge.step3.keepLeft': 'Keep left',
    'merge.step3.keepRight': 'Keep right',
    'merge.step3.leftSuffix': 'Left suffix',
    'merge.step3.rightSuffix': 'Right suffix',
    'merge.step3.confirm': 'Confirm Merge',
    'merge.step4.success': 'Merge Successful!',
    'merge.step4.desc': 'Your datasets have been combined into {rows} rows and saved to History.',
    'merge.step4.downloadCsv': 'Download CSV',
    'merge.step4.downloadExcel': 'Download Excel',
    'merge.step4.goAnalyzer': 'Go to Analyzer',
    'merge.preview.title': 'Preview — first 5 rows of',
    'merge.preview.total': 'total rows',
    'merge.btn.next': 'Next',
    'merge.btn.back': 'Back',
    'join.inner.label': 'Inner Join',
    'join.inner.desc': 'Only rows with a matching key in BOTH datasets.',
    'join.left.label': 'Left Join',
    'join.left.desc': 'All rows from the LEFT dataset; nulls where no right match.',
    'join.right.label': 'Right Join',
    'join.right.desc': 'All rows from the RIGHT dataset; nulls where no left match.',
    'join.full_outer.label': 'Full Outer Join',
    'join.full_outer.desc': 'All rows from BOTH datasets; nulls fill in the gaps.',
    'join.union.label': 'Union (Stack)',
    'join.union.desc': 'Vertical concatenation of both datasets. No key required.',
  
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

    // FILE UPLOADER
    'uploader.drag': 'Arraste e solte seu dataset aqui',
    'uploader.browse': 'ou clique para buscar no seu computador',
    'uploader.processing': 'Processando dataset...',
    'uploader.error.csv': 'Falha ao processar o arquivo CSV.',
    'uploader.error.xlsx': 'Falha ao processar o arquivo Excel.',
    'uploader.error.format': 'Formato não suportado. Envie um arquivo CSV ou XLSX.',
    'uploader.error.read': 'Falha ao ler o arquivo.',
    'uploader.error.empty': 'O arquivo Excel está vazio.',
    'uploader.error.unexpected': 'Ocorreu um erro inesperado.',

    // PIPELINE BUILDER
    'pipeline.builder.title': 'Construtor de Pipeline',
    'pipeline.builder.recipes': 'Receitas',
    'pipeline.builder.closeRecipes': 'Fechar Receitas',
    'pipeline.builder.saveCurrent': 'Salvar Atual',
    'pipeline.builder.export': 'Exportar',
    'pipeline.builder.import': 'Importar',
    'pipeline.builder.savedRecipes': 'Receitas Salvas:',
    'pipeline.builder.noRecipes': 'Nenhuma receita salva.',
    'pipeline.builder.empty': 'Seu pipeline está vazio.',
    'pipeline.builder.emptyHint': 'Adicione um passo abaixo para começar a transformar os dados.',
    'pipeline.builder.selectTransform': 'Selecionar Transformação',
    'pipeline.builder.addStep': 'Adicionar Passo',
    'pipeline.builder.cancel': 'Cancelar',
    'pipeline.builder.prompt.name': 'Nomeie esta receita de pipeline:',
    'pipeline.builder.saved': 'Receita salva localmente!',
    'pipeline.builder.emptyExport': 'Pipeline está vazio.',
    'pipeline.builder.invalidFile': 'Arquivo de receita inválido.',
    'pipeline.builder.steps': 'passos',

    // TRANSFORMATION TYPES
    'transform.REMOVE_DUPLICATES.label': 'Remover Duplicatas',
    'transform.REMOVE_DUPLICATES.desc': 'Exclui linhas idênticas com base nas colunas selecionadas.',
    'transform.REMOVE_NULLS.label': 'Remover Nulos',
    'transform.REMOVE_NULLS.desc': 'Remove qualquer linha que contenha valores nulos/vazios na coluna escolhida.',
    'transform.FILL_NULLS.label': 'Preencher Nulos',
    'transform.FILL_NULLS.desc': 'Substitui valores nulos/vazios por um texto ou número padrão.',
    'transform.RENAME_COLUMN.label': 'Renomear Coluna',
    'transform.RENAME_COLUMN.desc': 'Altera o nome de uma coluna existente.',
    'transform.REMOVE_COLUMN.label': 'Remover Coluna',
    'transform.REMOVE_COLUMN.desc': 'Exclui uma coluna inteira do dataset.',
    'transform.CONVERT_TYPE.label': 'Converter Tipo',
    'transform.CONVERT_TYPE.desc': 'Muda o formato dos dados (ex: Texto para Número ou Data).',
    'transform.NORMALIZE_TEXT.label': 'Normalizar Texto',
    'transform.NORMALIZE_TEXT.desc': 'Padroniza textos (MAIÚSCULAS, minúsculas, Remover espaços).',
    'transform.FILTER_ROWS.label': 'Filtrar Linhas',
    'transform.FILTER_ROWS.desc': 'Mantém ou remove linhas que correspondam a uma condição específica.',
    'transform.SORT_DATA.label': 'Ordenar Dados',
    'transform.SORT_DATA.desc': 'Ordena linhas alfabética ou numericamente (A-Z, Z-A).',
    'transform.CALCULATED_COLUMN.label': 'Coluna Calculada',
    'transform.CALCULATED_COLUMN.desc': 'Cria uma nova coluna usando fórmulas (ex: Qtd * Preço).',
    'transform.MASK_DATA.label': 'Mascarar Dados (LGPD)',
    'transform.MASK_DATA.desc': 'Anonimiza informações sensíveis como E-mails ou Documentos.',
    'transform.GROUP_BY.label': 'Agrupar / Pivô',
    'transform.GROUP_BY.desc': 'Agrupa linhas e calcula somas, médias ou contagens.',
    'transform.FUZZY_DEDUPLICATE.label': 'Deduplicação Fuzzy',
    'transform.FUZZY_DEDUPLICATE.desc': 'Encontra e mescla textos similares com erros de digitação (ex: "Jonh" e "John").',

    // MERGE PAGE
    'merge.title': 'Mesclar Datasets',
    'merge.subtitle': 'Combine dois datasets salvos com um join estilo SQL. O resultado será salvo no seu histórico e aberto no Analisador.',

    // MERGE CONFIGURATOR
    'merge.loading': 'Carregando datasets…',
    'merge.need2.title': 'São necessários pelo menos 2 datasets',
    'merge.need2.desc': 'Envie dois ou mais datasets antes de mesclar.',
    'merge.need2.cta': '+ Enviar Novo Dataset',
    'merge.step1.label': 'Selecionar Datasets',
    'merge.step2.label': 'Configurar Join',
    'merge.step3.label': 'Resolver Conflitos',
    'merge.step4.label': 'Download',
    'merge.step1.title': 'Selecione os dois datasets para mesclar',
    'merge.step1.leftLabel': 'Dataset esquerdo (A)',
    'merge.step1.rightLabel': 'Dataset direito (B)',
    'merge.step1.sameError': 'Selecione dois datasets diferentes.',
    'merge.step1.rows': 'linhas',
    'merge.step1.columns': 'colunas',
    'merge.step2.title': 'Escolha o tipo de join e as colunas-chave',
    'merge.step2.joinType': 'Tipo de Join',
    'merge.step2.leftKey': 'Coluna-chave esquerda',
    'merge.step2.rightKey': 'Coluna-chave direita',
    'merge.step3.title': 'Resolver Conflitos de Colunas',
    'merge.step3.noConflicts': 'Nenhum conflito de nome de coluna detectado.',
    'merge.step3.conflicts': 'As seguintes colunas existem em ambos os datasets:',
    'merge.step3.suffix': 'Adicionar sufixo',
    'merge.step3.keepLeft': 'Manter esquerdo',
    'merge.step3.keepRight': 'Manter direito',
    'merge.step3.leftSuffix': 'Sufixo esquerdo',
    'merge.step3.rightSuffix': 'Sufixo direito',
    'merge.step3.confirm': 'Confirmar Mescla',
    'merge.step4.success': 'Mescla Concluída!',
    'merge.step4.desc': 'Seus datasets foram combinados em {rows} linhas e salvos no Histórico.',
    'merge.step4.downloadCsv': 'Baixar CSV',
    'merge.step4.downloadExcel': 'Baixar Excel',
    'merge.step4.goAnalyzer': 'Ir ao Analisador',
    'merge.preview.title': 'Prévia — primeiras 5 linhas de',
    'merge.preview.total': 'linhas no total',
    'merge.btn.next': 'Próximo',
    'merge.btn.back': 'Voltar',
    'join.inner.label': 'Inner Join',
    'join.inner.desc': 'Apenas linhas com chave correspondente em AMBOS os datasets.',
    'join.left.label': 'Left Join',
    'join.left.desc': 'Todas as linhas do dataset ESQUERDO; nulos onde não há correspondência direita.',
    'join.right.label': 'Right Join',
    'join.right.desc': 'Todas as linhas do dataset DIREITO; nulos onde não há correspondência esquerda.',
    'join.full_outer.label': 'Full Outer Join',
    'join.full_outer.desc': 'Todas as linhas de AMBOS os datasets; nulos preenchem as lacunas.',
    'join.union.label': 'Union (Empilhar)',
    'join.union.desc': 'Concatenação vertical de ambos os datasets. Nenhuma chave necessária.',
  
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

    // FILE UPLOADER
    'uploader.drag': 'Arrastre y suelte su conjunto de datos aquí',
    'uploader.browse': 'o haga clic para buscar en su computadora',
    'uploader.processing': 'Procesando conjunto de datos...',
    'uploader.error.csv': 'Error al procesar el archivo CSV.',
    'uploader.error.xlsx': 'Error al procesar el archivo Excel.',
    'uploader.error.format': 'Formato no soportado. Suba un archivo CSV o XLSX.',
    'uploader.error.read': 'Error al leer el archivo.',
    'uploader.error.empty': 'El archivo Excel está vacío.',
    'uploader.error.unexpected': 'Ocurrió un error inesperado.',

    // PIPELINE BUILDER
    'pipeline.builder.title': 'Constructor de Pipeline',
    'pipeline.builder.recipes': 'Recetas',
    'pipeline.builder.closeRecipes': 'Cerrar Recetas',
    'pipeline.builder.saveCurrent': 'Guardar Actual',
    'pipeline.builder.export': 'Exportar',
    'pipeline.builder.import': 'Importar',
    'pipeline.builder.savedRecipes': 'Recetas Guardadas:',
    'pipeline.builder.noRecipes': 'No se encontraron recetas guardadas.',
    'pipeline.builder.empty': 'Su pipeline está vacío.',
    'pipeline.builder.emptyHint': 'Agregue un paso abajo para comenzar a transformar los datos.',
    'pipeline.builder.selectTransform': 'Seleccionar Transformación',
    'pipeline.builder.addStep': 'Agregar Paso',
    'pipeline.builder.cancel': 'Cancelar',
    'pipeline.builder.prompt.name': 'Nombre esta receta de pipeline:',
    'pipeline.builder.saved': '¡Receta guardada localmente!',
    'pipeline.builder.emptyExport': 'El pipeline está vacío.',
    'pipeline.builder.invalidFile': 'Archivo de receta inválido.',
    'pipeline.builder.steps': 'pasos',

    // TRANSFORMATION TYPES
    'transform.REMOVE_DUPLICATES.label': 'Eliminar Duplicados',
    'transform.REMOVE_DUPLICATES.desc': 'Elimina filas idénticas según las columnas seleccionadas.',
    'transform.REMOVE_NULLS.label': 'Eliminar Nulos',
    'transform.REMOVE_NULLS.desc': 'Elimina cualquier fila que contenga valores nulos/vacíos en la columna elegida.',
    'transform.FILL_NULLS.label': 'Rellenar Nulos',
    'transform.FILL_NULLS.desc': 'Reemplaza valores nulos/vacíos con un texto o número predeterminado.',
    'transform.RENAME_COLUMN.label': 'Renombrar Columna',
    'transform.RENAME_COLUMN.desc': 'Cambia el nombre de una columna existente.',
    'transform.REMOVE_COLUMN.label': 'Eliminar Columna',
    'transform.REMOVE_COLUMN.desc': 'Elimina una columna completa del conjunto de datos.',
    'transform.CONVERT_TYPE.label': 'Convertir Tipo',
    'transform.CONVERT_TYPE.desc': 'Cambia el formato de los datos (ej: Texto a Número o Fecha).',
    'transform.NORMALIZE_TEXT.label': 'Normalizar Texto',
    'transform.NORMALIZE_TEXT.desc': 'Estandariza textos (MAYÚSCULAS, minúsculas, Recortar espacios).',
    'transform.FILTER_ROWS.label': 'Filtrar Filas',
    'transform.FILTER_ROWS.desc': 'Mantiene o elimina filas que coincidan con una condición específica.',
    'transform.SORT_DATA.label': 'Ordenar Datos',
    'transform.SORT_DATA.desc': 'Ordena filas alfabética o numéricamente (A-Z, Z-A).',
    'transform.CALCULATED_COLUMN.label': 'Columna Calculada',
    'transform.CALCULATED_COLUMN.desc': 'Crea una nueva columna usando fórmulas (ej: Ctd * Precio).',
    'transform.MASK_DATA.label': 'Enmascarar Datos (LGPD)',
    'transform.MASK_DATA.desc': 'Anonimiza información sensible como Correos o Documentos.',
    'transform.GROUP_BY.label': 'Agrupar / Pivote',
    'transform.GROUP_BY.desc': 'Agrupa filas y calcula sumas, promedios o recuentos.',
    'transform.FUZZY_DEDUPLICATE.label': 'Deduplicación Difusa',
    'transform.FUZZY_DEDUPLICATE.desc': 'Encuentra y fusiona textos similares con errores tipográficos (ej: "Jonh" y "John").',

    // MERGE PAGE
    'merge.title': 'Combinar Conjuntos de Datos',
    'merge.subtitle': 'Combine dos conjuntos de datos guardados usando un join de estilo SQL. El resultado se guardará en su historial y se abrirá en el Analizador.',

    // MERGE CONFIGURATOR
    'merge.loading': 'Cargando conjuntos de datos…',
    'merge.need2.title': 'Se requieren al menos 2 conjuntos de datos',
    'merge.need2.desc': 'Suba dos o más conjuntos de datos antes de combinarlos.',
    'merge.need2.cta': '+ Subir Nuevo Conjunto de Datos',
    'merge.step1.label': 'Seleccionar Conjuntos',
    'merge.step2.label': 'Configurar Join',
    'merge.step3.label': 'Resolver Conflictos',
    'merge.step4.label': 'Descarga',
    'merge.step1.title': 'Seleccione los dos conjuntos de datos a combinar',
    'merge.step1.leftLabel': 'Conjunto izquierdo (A)',
    'merge.step1.rightLabel': 'Conjunto derecho (B)',
    'merge.step1.sameError': 'Seleccione dos conjuntos de datos diferentes.',
    'merge.step1.rows': 'filas',
    'merge.step1.columns': 'columnas',
    'merge.step2.title': 'Elija el tipo de join y las columnas clave',
    'merge.step2.joinType': 'Tipo de Join',
    'merge.step2.leftKey': 'Columna clave izquierda',
    'merge.step2.rightKey': 'Columna clave derecha',
    'merge.step3.title': 'Resolver Conflictos de Columnas',
    'merge.step3.noConflicts': 'No se detectaron conflictos de nombres de columnas.',
    'merge.step3.conflicts': 'Las siguientes columnas existen en ambos conjuntos:',
    'merge.step3.suffix': 'Agregar sufijo',
    'merge.step3.keepLeft': 'Mantener izquierdo',
    'merge.step3.keepRight': 'Mantener derecho',
    'merge.step3.leftSuffix': 'Sufijo izquierdo',
    'merge.step3.rightSuffix': 'Sufijo derecho',
    'merge.step3.confirm': 'Confirmar Combinación',
    'merge.step4.success': '¡Combinación Exitosa!',
    'merge.step4.desc': 'Sus conjuntos de datos se combinaron en {rows} filas y se guardaron en el Historial.',
    'merge.step4.downloadCsv': 'Descargar CSV',
    'merge.step4.downloadExcel': 'Descargar Excel',
    'merge.step4.goAnalyzer': 'Ir al Analizador',
    'merge.preview.title': 'Vista previa — primeras 5 filas de',
    'merge.preview.total': 'filas en total',
    'merge.btn.next': 'Siguiente',
    'merge.btn.back': 'Volver',
    'join.inner.label': 'Inner Join',
    'join.inner.desc': 'Solo filas con clave coincidente en AMBOS conjuntos.',
    'join.left.label': 'Left Join',
    'join.left.desc': 'Todas las filas del conjunto IZQUIERDO; nulos donde no hay coincidencia derecha.',
    'join.right.label': 'Right Join',
    'join.right.desc': 'Todas las filas del conjunto DERECHO; nulos donde no hay coincidencia izquierda.',
    'join.full_outer.label': 'Full Outer Join',
    'join.full_outer.desc': 'Todas las filas de AMBOS conjuntos; nulos llenan los huecos.',
    'join.union.label': 'Union (Apilar)',
    'join.union.desc': 'Concatenación vertical de ambos conjuntos. No se requiere clave.',
  
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
