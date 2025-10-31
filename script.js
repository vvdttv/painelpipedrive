// --- VARIÁVEIS GLOBAIS ---
let API_KEY = '';
let BASE_URL = ''; // Definida em fetchInitialData

let parsedData = [];
let columnHeaders = [];

let pdFields = { organization: [], person: [], deal: [] };
let pdUsers = [];
let pdPipelines = [];
let pdStages = [];
let pdPermissionSets = []; 
let pdActivityTypes = []; 

// Ponto 7: Guarda as configurações para a tela de validação
let currentImportSettings = {}; 
let currentImportMapping = {};

// Lista de verticais fixa (Ponto 3)
const FIXED_VERTICALS = [
    "Distribuidoras", "Indústria e Manufatura", "Alimentos e Bebidas", "Outros", 
    "Máquinas e Equipamentos", "Metal e Siderurgia", "Serviços Gerais", 
    "Materiais de Construção", "Agronegócio", "Plástico e Borracha", "Varejo", 
    "Tecnologia e Informática", "Serviços Profissionais", "Têxtil e Vestuário",s
    "Químico e Petroquímico", "Automotivo", "Cred", "Papel e Celulose", 
    "Móveis e Decoração", "Comunicação e Publicidade", "Transporte e Logística", 
    "Energia", "Pet", "Couro e Calçados", "Reciclagem", "Comércio Geral", 
    "Educação", "Limpeza e Conservação", "Saúde", "Segurança", "Eventos", 
    "Mineração", "Combustíveis"
].sort(); // Ordena alfabeticamente

// Ícones de Atividade (Ponto 2)
const ACTIVITY_ICONS = [
    'task', 'email', 'meeting', 'deadline', 'call', 'lunch', 'calendar', 
    'downarrow', 'uparrow', 'person', 'dollar', 'phone', 'note', 'suitcase', 
    'cart', 'truck', 'bubble', 'cog', 'appointment', 'bell', 'camera', 
    'warning', 'check', 'message', 'search', 'scissors', 'briefcase', 'company'
].sort();

let distributionRules = {}; // { userId: [vertical1, vertical2], ... } -> Verticais selecionadas

// --- ELEMENTOS DO DOM ---
// CORREÇÃO: O objeto dom estava quebrado no arquivo anterior.
// As definições de elementos (step4Config, etc.) foram restauradas
// e os event listeners (dom.startImportBtn.addEventListener...) foram movidos
// para o 'DOMContentLoaded'
const dom = {
    apiTokenInput: document.getElementById('api-token'),
    companyDomainInput: document.getElementById('company-domain'), 
    globalLoader: document.getElementById('global-loader'),
    globalMessage: document.getElementById('global-message'),
    mainContent: document.getElementById('main-content'), 
    
    // Abas Principais
    tabs: document.querySelectorAll('.tab-btn'),
    tabsContent: document.querySelectorAll('#tabs-content > div'),
    tabImporter: document.getElementById('tab-importer'),
    tabVerticals: document.getElementById('tab-verticals'),
    tabAdmin: document.getElementById('tab-admin'),

    // Ponto 8 (Sub-abas do Importador)
    importerSubTabs: document.querySelectorAll('.importer-subtab-btn'),
    importerSubTabsContent: document.querySelectorAll('#importer-subtabs-content > div'),

    // Aba Importador
    step1: document.getElementById('step-1-upload'),
    csvFileInput: document.getElementById('csv-file'),
    loadCsvBtn: document.getElementById('load-csv-btn'),
    
    // Ponto 1 & 2: Nova Etapa 2
    step2Duplicates: document.getElementById('step-2-duplicates'),
    duplicateLoader: document.getElementById('duplicate-loader'),
    duplicateStatus: document.getElementById('duplicate-status'),
    duplicateProgressBar: document.getElementById('duplicate-progress-bar'),
    duplicateProgressText: document.getElementById('duplicate-progress-text'),
    duplicateLogContainer: document.getElementById('duplicate-log-container'),

    // Ponto 3-6: Nova Etapa 2.5
    step2_5Adjustment: document.getElementById('step-2-5-adjustment'),
    duplicateAdjustmentContainer: document.getElementById('duplicate-adjustment-container'),
    adjustmentProcessBtn: document.getElementById('adjustment-process-btn'),
    adjustmentSkipBtn: document.getElementById('adjustment-skip-btn'),

    // Etapa 3 (Mapeamento) - Antiga 2
    step3Mapping: document.getElementById('step-3-mapping'),
    mappingContainer: document.getElementById('mapping-container'),
    
    // Etapa 4 (Config) - Antiga 3 (RESTAURO)
    step4Config: document.getElementById('step-4-config'),
    pipelineSelect: document.getElementById('pipeline-select'),
    stageSelect: document.getElementById('stage-select'),
    defaultUserSelect: document.getElementById('default-user-select'),
    verticalRuleColumnSelect: document.getElementById('vertical-column-select'),
    startImportBtn: document.getElementById('start-import-btn'),
    dealLogicRadios: document.querySelectorAll('input[name="deal-logic"]'),
    dealLogicStatusOptions: document.getElementById('deal-logic-status-options'),
    dealLogicStatusWon: document.getElementById('deal-status-won'),
    dealLogicStatusLost: document.getElementById('deal-status-lost'),
    dealLogicStatusOpen: document.getElementById('deal-status-open'),
    
    // Ponto 7 (Lógica "NÃO") (RESTAURO)
    dealLogicNotStatusOptions: document.getElementById('deal-logic-not-status-options'),
    dealLogicNotStatusWon: document.getElementById('deal-not-status-won'),
    dealLogicNotStatusLost: document.getElementById('deal-not-status-lost'),
    dealLogicNotStatusOpen: document.getElementById('deal-not-status-open'),

    // Etapa 5 (Validação) - Antiga 4 (RESTAURO)
    step5Validation: document.getElementById('step-5-validation'),
    validationSampleContainer: document.getElementById('validation-sample-container'),
    validationSettingsSummary: document.getElementById('validation-settings-summary'),
    validationBackBtn: document.getElementById('validation-back-btn'),
    validationStartBtn: document.getElementById('validation-start-btn'),

    // Etapa 6 (Log) - Antiga 5 (RESTAURO)
    step6Log: document.getElementById('step-6-log'),
    importLoader: document.getElementById('import-loader'),
    importStatus: document.getElementById('import-status'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    logContainer: document.getElementById('log-container'),
    
    // Aba Gestão de Verticais (RESTAURO)
    verticalsContainer: document.getElementById('verticals-container'),
    verticalsMessage: document.getElementById('verticals-message'),
    saveVerticalsBtn: document.getElementById('save-verticals-btn'),
    
    // Aba Admin (RESTAURO)
    adminMessage: document.getElementById('admin-message'),
    adminTabs: document.querySelectorAll('.admin-tab-btn'),
    adminTabsSelect: document.getElementById('admin-tabs-select'),
    adminTabsContent: document.querySelectorAll('#admin-tabs-content > div'),

    // Admin Funis (RESTAURO)
    adminPipelinesView: document.getElementById('admin-pipelines-view'),
    adminPipelinesLoader: document.getElementById('admin-pipelines-loader'),
    adminPipelinesTableContainer: document.getElementById('admin-pipelines-table-container'),
    adminAddPipelineBtn: document.getElementById('admin-add-pipeline-btn'),
    
    // Admin Etapas (RESTAURO)
    adminStagesView: document.getElementById('admin-stages-view'),
    adminStagesLoader: document.getElementById('admin-stages-loader'),
    adminStagesTableContainer: document.getElementById('admin-stages-table-container'),
    adminStagesTitle: document.getElementById('admin-stages-title'),
    adminAddStageBtn: document.getElementById('admin-add-stage-btn'),
    adminBackToPipelinesBtn: document.getElementById('admin-back-to-pipelines-btn'),
    
    // Admin Produtos (RESTAURO)
    adminProductsLoader: document.getElementById('admin-products-loader'),
    adminProductsTableContainer: document.getElementById('admin-products-table-container'),
    adminAddProductBtn: document.getElementById('admin-add-product-btn'),

    // ADICIONADO: Tipos de Atividade (RESTAURO)
    adminActivityTypesLoader: document.getElementById('admin-activityTypes-loader'),
    adminActivityTypesTableContainer: document.getElementById('admin-activityTypes-table-container'),
    adminAddActivityTypeBtn: document.getElementById('admin-add-activityType-btn'),
    
    // Admin Campos (RESTAURO)
    adminFieldsLoader: document.getElementById('admin-fields-loader'),
    adminFieldsTableContainer: document.getElementById('admin-fields-table-container'),
    adminAddFieldBtn: document.getElementById('admin-add-field-btn'),
    adminFieldEntitySelect: document.getElementById('admin-field-entity-select'),

    // Admin Usuários (RESTAURO)
    adminUsersLoader: document.getElementById('admin-users-loader'),
    adminUsersTableContainer: document.getElementById('admin-users-table-container'),
    adminAddUserBtn: document.getElementById('admin-add-user-btn'),

    // Modais (RESTAURO)
    adminModal: document.getElementById('admin-modal'),
    adminModalForm: document.getElementById('admin-modal-form'),
  _ ... (O RESTO DO SEU JAVASCRIPT) ... _
                 throw fetchError; // Re-throw the error to be caught by the calling function
            }
        }