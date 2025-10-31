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
    "Tecnologia e Informática", "Serviços Profissionais", "Têxtil e Vestuário",
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
const dom = {
    apiTokenInput: document.getElementById('api-token'),
    companyDomainInput: document.getElementById('company-domain'), 
    connectApiBtn: document.getElementById('connect-api-btn'), // NOVO BOTÃO
    apiLoader: document.getElementById('api-loader'), // NOVO LOADER DE CONEXÃO
    apiMessage: document.getElementById('api-message'), // NOVA MENSAGEM DE CONEXÃO
    apiConnectSection: document.getElementById('api-connect-section'), // NOVA SEÇÃO PARA OCULTAR
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
    fileStatus: document.getElementById('file-status'),
    filePreview: document.getElementById('file-preview'),
    previewHeader: document.getElementById('preview-header'),
    previewBody: document.getElementById('preview-body'),
    
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
    nextToConfigBtn: document.getElementById('next-to-config-btn'),
    
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
    backToMappingBtn: document.getElementById('back-to-mapping-btn'),
    nextToValidationBtn: document.getElementById('next-to-validation-btn'),

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
    resetImporterBtn: document.getElementById('reset-importer-btn'),
    
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
    adminPipelinesTableBody: document.getElementById('admin-pipelines-table-body'),
    adminAddPipelineBtn: document.getElementById('admin-add-pipeline-btn'),
    
    // Admin Etapas (RESTAURO)
    adminStagesView: document.getElementById('admin-stages-view'),
    adminStagesLoader: document.getElementById('admin-stages-loader'),
    adminStagesTableContainer: document.getElementById('admin-stages-table-container'),
    adminStagesTableBody: document.getElementById('admin-stages-table-body'),
    adminStagesTitle: document.getElementById('admin-stages-title'),
    adminAddStageBtn: document.getElementById('admin-add-stage-btn'),
    adminBackToPipelinesBtn: document.getElementById('admin-back-to-pipelines-btn'),
    
    // Admin Produtos (RESTAURO)
    adminProductsView: document.getElementById('admin-products-view'),
    adminProductsLoader: document.getElementById('admin-products-loader'),
    adminProductsTableContainer: document.getElementById('admin-products-table-container'),
    adminProductsTableBody: document.getElementById('admin-products-table-body'),
    adminAddProductBtn: document.getElementById('admin-add-product-btn'),

    // ADICIONADO: Tipos de Atividade (RESTAURO)
    adminActivityTypesView: document.getElementById('admin-activity-types-view'),
    adminActivityTypesLoader: document.getElementById('admin-activityTypes-loader'),
    adminActivityTypesTableContainer: document.getElementById('admin-activityTypes-table-container'),
    adminActivityTypesTableBody: document.getElementById('admin-activityTypes-table-body'),
    adminAddActivityTypeBtn: document.getElementById('admin-add-activityType-btn'),
    
    // Admin Campos (RESTAURO)
    adminFieldsView: document.getElementById('admin-fields-view'),
    adminFieldsLoader: document.getElementById('admin-fields-loader'),
    adminFieldsTableContainer: document.getElementById('admin-fields-table-container'),
    adminFieldsTableBody: document.getElementById('admin-fields-table-body'),
    adminAddFieldBtn: document.getElementById('admin-add-field-btn'),
    adminFieldEntitySelect: document.getElementById('admin-field-entity-select'),

    // Admin Usuários (RESTAURO)
    adminUsersView: document.getElementById('admin-users-view'),
    adminUsersLoader: document.getElementById('admin-users-loader'),
    adminUsersTableContainer: document.getElementById('admin-users-table-container'),
    adminUsersTableBody: document.getElementById('admin-users-table-body'),
    adminAddUserBtn: document.getElementById('admin-add-user-btn'),

    // Modais (RESTAURO)
    adminModal: document.getElementById('admin-modal'),
    adminModalForm: document.getElementById('admin-modal-form'),
    adminModalTitle: document.getElementById('admin-modal-title'),
    adminModalBody: document.getElementById('admin-modal-body'),
    adminModalSubmitBtn: document.getElementById('admin-modal-submit-btn'),
    adminModalCancelBtn: document.getElementById('admin-modal-cancel-btn'),

    confirmModal: document.getElementById('confirm-modal'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalBody: document.getElementById('confirm-modal-body'),
    confirmModalConfirmBtn: document.getElementById('confirm-modal-confirm-btn'),
    confirmModalCancelBtn: document.getElementById('confirm-modal-cancel-btn'),
};

// --- FUNÇÕES DE UTILIDADE ---

function showGlobalMessage(message, type = 'info') {
    dom.globalMessage.textContent = message;
    dom.globalMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
    if (type === 'error') {
        dom.globalMessage.classList.add('bg-red-100', 'text-red-700');
    } else if (type === 'success') {
        dom.globalMessage.classList.add('bg-green-100', 'text-green-700');
    } else {
        dom.globalMessage.classList.add('bg-blue-100', 'text-blue-700');
    }
    dom.globalMessage.classList.remove('hidden');
}

function hideGlobalMessage() {
    dom.globalMessage.classList.add('hidden');
}

function showApiMessage(message, type = 'info') { // NOVA FUNÇÃO
    dom.apiMessage.textContent = message;
    dom.apiMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
    if (type === 'error') {
        dom.apiMessage.classList.add('bg-red-100', 'text-red-700');
    } else if (type === 'success') {
        dom.apiMessage.classList.add('bg-green-100', 'text-green-700');
    } else {
        dom.apiMessage.classList.add('bg-blue-100', 'text-blue-
