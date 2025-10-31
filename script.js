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

// Guarda as configurações para a tela de validação
let currentImportSettings = {}; 
let currentImportMapping = {};

// Lista de verticais fixa
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

// Ícones de Atividade
const ACTIVITY_ICONS = [
    'task', 'email', 'meeting', 'deadline', 'call', 'lunch', 'calendar', 
    'downarrow', 'uparrow', 'person', 'dollar', 'phone', 'note', 'suitcase', 
    'cart', 'truck', 'bubble', 'cog', 'appointment', 'bell', 'camera', 
    'warning', 'check', 'message', 'search', 'scissors', 'briefcase', 'company'
].sort();

let distributionRules = {}; // { userId: [vertical1, vertical2], ... } -> Verticais selecionadas

// --- ELEMENTOS DO DOM ---
// Objeto DOM baseado no SEU HTML (o que você subiu)
const dom = {
    apiTokenInput: document.getElementById('api-token'),
    companyDomainInput: document.getElementById('company-domain'), 
    connectApiBtn: document.getElementById('connect-api-btn'),
    apiLoader: document.getElementById('api-loader'),
    apiMessage: document.getElementById('api-message'),
    apiConnectSection: document.getElementById('api-connect-section'),
    globalMessage: document.getElementById('global-message'),
    mainContent: document.getElementById('main-content'), 
    
    // Abas Principais
    tabs: document.querySelectorAll('.tab-btn'),
    tabsContent: document.querySelectorAll('#tabs-content > div'),
    tabImporter: document.getElementById('tab-importer'),
    tabVerticals: document.getElementById('tab-verticals'),
    tabAdmin: document.getElementById('tab-admin'),

    // Sub-abas do Importador
    importerSubTabs: document.querySelectorAll('.importer-subtab-btn'),
    importerSubTabsContent: document.querySelectorAll('#importer-subtabs-content > div'),

    // Aba Importador - Etapa 1
    step1: document.getElementById('step-1-upload'),
    csvFileInput: document.getElementById('csv-file'),
    loadCsvBtn: document.getElementById('load-csv-btn'),
    fileStatus: document.getElementById('file-status'),
    filePreview: document.getElementById('file-preview'),
    previewHeader: document.getElementById('preview-header'),
    previewBody: document.getElementById('preview-body'),
    
    // Etapa 2 (Duplicatas)
    step2Duplicates: document.getElementById('step-2-duplicates'),
    duplicateLoader: document.getElementById('duplicate-loader'),
    duplicateStatus: document.getElementById('duplicate-status'),
    duplicateProgressBar: document.getElementById('duplicate-progress-bar'),
    duplicateProgressText: document.getElementById('duplicate-progress-text'),
    duplicateLogContainer: document.getElementById('duplicate-log-container'),
    duplicateNextStepContainer: document.getElementById('duplicate-next-step-container'),
    duplicateNextStepBtn: document.getElementById('duplicate-next-step-btn'),

    // Etapa 2.5 (Ajuste)
    step2_5Adjustment: document.getElementById('step-2-5-adjustment'),
    duplicateAdjustmentContainer: document.getElementById('duplicate-adjustment-container'),
    adjustmentProcessBtn: document.getElementById('adjustment-process-btn'),
    adjustmentSkipBtn: document.getElementById('adjustment-skip-btn'),

    // Etapa 3 (Mapeamento)
    step3Mapping: document.getElementById('step-3-mapping'),
    mappingContainer: document.getElementById('mapping-container'),
    nextToConfigBtn: document.getElementById('next-to-config-btn'),
    
    // Etapa 4 (Config)
    step4Config: document.getElementById('step-4-config'),
    pipelineSelect: document.getElementById('pipeline-select'),
    stageSelect: document.getElementById('stage-select'),
    defaultUserSelect: document.getElementById('default-user-select'),
    verticalRuleColumnSelect: document.getElementById('vertical-column-select'),
    dealLogicRadios: document.querySelectorAll('input[name="deal-logic"]'),
    dealLogicStatusOptions: document.getElementById('deal-logic-status-options'),
    dealLogicStatusWon: document.getElementById('deal-status-won'),
    dealLogicStatusLost: document.getElementById('deal-status-lost'),
    dealLogicStatusOpen: document.getElementById('deal-status-open'),
    dealLogicNotStatusOptions: document.getElementById('deal-logic-not-status-options'),
    dealLogicNotStatusWon: document.getElementById('deal-not-status-won'),
    dealLogicNotStatusLost: document.getElementById('deal-not-status-lost'),
    dealLogicNotStatusOpen: document.getElementById('deal-not-status-open'),
    backToMappingBtn: document.getElementById('back-to-mapping-btn'),
    nextToValidationBtn: document.getElementById('next-to-validation-btn'),

    // Etapa 5 (Validação)
    step5Validation: document.getElementById('step-5-validation'),
    validationSampleContainer: document.getElementById('validation-sample-container'),
    validationSettingsSummary: document.getElementById('validation-settings-summary'),
    validationBackBtn: document.getElementById('validation-back-btn'),
    validationStartBtn: document.getElementById('validation-start-btn'),
    validationSampleHeader: document.getElementById('validation-sample-header'),
    validationSampleBody: document.getElementById('validation-sample-body'),

    // Etapa 6 (Log)
    step6Log: document.getElementById('step-6-log'),
    importLoader: document.getElementById('import-loader'),
    importStatus: document.getElementById('import-status'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    logContainer: document.getElementById('log-container'),
    resetImporterBtn: document.getElementById('reset-importer-btn'),
    
    // Aba Gestão de Verticais
    verticalsContainer: document.getElementById('verticals-container'),
    verticalsMessage: document.getElementById('verticals-message'),
    saveVerticalsBtn: document.getElementById('save-verticals-btn'),
    
    // Aba Admin
    adminMessage: document.getElementById('admin-message'),
    adminTabs: document.querySelectorAll('.admin-tab-btn'),
    adminTabsSelect: document.getElementById('admin-tabs-select'),
    adminTabsContent: document.querySelectorAll('#admin-tabs-content > div'),

    // Admin Funis
    adminPipelinesView: document.getElementById('admin-pipelines-view'),
    adminPipelinesLoader: document.getElementById('admin-pipelines-loader'),
    adminPipelinesTableContainer: document.getElementById('admin-pipelines-table-container'),
    adminPipelinesTableBody: document.getElementById('admin-pipelines-table-body'),
    adminAddPipelineBtn: document.getElementById('admin-add-pipeline-btn'),
    
    // Admin Etapas
    adminStagesView: document.getElementById('admin-stages-view'),
    adminStagesLoader: document.getElementById('admin-stages-loader'),
    adminStagesTableContainer: document.getElementById('admin-stages-table-container'),
    adminStagesTableBody: document.getElementById('admin-stages-table-body'),
    adminStagesTitle: document.getElementById('admin-stages-title'),
    adminAddStageBtn: document.getElementById('admin-add-stage-btn'),
    adminBackToPipelinesBtn: document.getElementById('admin-back-to-pipelines-btn'),
    
    // Admin Produtos
    adminProductsView: document.getElementById('admin-products-view'),
    adminProductsLoader: document.getElementById('admin-products-loader'),
    adminProductsTableContainer: document.getElementById('admin-products-table-container'),
    adminProductsTableBody: document.getElementById('admin-products-table-body'),
    adminAddProductBtn: document.getElementById('admin-add-product-btn'),

    // Tipos de Atividade
    adminActivityTypesView: document.getElementById('admin-activity-types-view'),
    adminActivityTypesLoader: document.getElementById('admin-activityTypes-loader'),
    adminActivityTypesTableContainer: document.getElementById('admin-activityTypes-table-container'),
    adminActivityTypesTableBody: document.getElementById('admin-activityTypes-table-body'),
    adminAddActivityTypeBtn: document.getElementById('admin-add-activityType-btn'),
    
    // Admin Campos
    adminFieldsView: document.getElementById('admin-fields-view'),
    adminFieldsLoader: document.getElementById('admin-fields-loader'),
    adminFieldsTableContainer: document.getElementById('admin-fields-table-container'),
    adminFieldsTableBody: document.getElementById('admin-fields-table-body'),
    adminAddFieldBtn: document.getElementById('admin-add-field-btn'),
    adminFieldEntitySelect: document.getElementById('admin-field-entity-select'),

    // Admin Usuários
    adminUsersView: document.getElementById('admin-users-view'),
    adminUsersLoader: document.getElementById('admin-users-loader'),
    adminUsersTableContainer: document.getElementById('admin-users-table-container'),
    adminUsersTableBody: document.getElementById('admin-users-table-body'),
    adminAddUserBtn: document.getElementById('admin-add-user-btn'),

    // Modais
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
    window.scrollTo(0, 0);
}

function hideGlobalMessage() {
    dom.globalMessage.classList.add('hidden');
}

function showApiMessage(message, type = 'info') {
    dom.apiMessage.textContent = message;
    dom.apiMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
    if (type === 'error') {
        dom.apiMessage.classList.add('bg-red-100', 'text-red-700');
    } else if (type === 'success') {
        dom.apiMessage.classList.add('bg-green-100', 'text-green-700');
    } else {
        dom.apiMessage.classList.add('bg-blue-100', 'text-blue-700');
    }
}

function hideApiMessage() {
    dom.apiMessage.classList.add('hidden');
}

function logToScreen(container, message, type = 'log') {
    const colors = {
        log: 'text-gray-700',
        info: 'text-blue-700',
        success: 'text-green-700',
        warn: 'text-yellow-700',
        error: 'text-red-700'
    };
    const color = colors[type] || colors.log;
    const timestamp = new Date().toLocaleTimeString();
    const p = document.createElement('p');
    p.className = `${color} text-sm`;
    p.innerHTML = `<span class="font-medium">[${timestamp}]</span>: ${message}`;
    
    if (container) {
        // Remove a mensagem inicial "Logs..."
        if (container.children.length === 1 && container.children[0].textContent.includes('...')) {
            container.innerHTML = '';
        }
        container.appendChild(p);
        container.scrollTop = container.scrollHeight;
    } else {
        console[type === 'error' ? 'error' : 'log'](message);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initChoices(element, options = {}) {
    if (element.choicesInstance) {
        element.choicesInstance.destroy();
    }
    element.choicesInstance = new Choices(element, {
        searchEnabled: true,
        removeItemButton: options.removeItemButton || false,
        itemSelectText: 'Selecionar',
        loadingText: 'Carregando...',
        noResultsText: 'Nenhum resultado',
        noChoicesText: 'Sem opções',
        shouldSort: false,
        ...options
    });
    return element.choicesInstance;
}

function addDefaultFields() {
    // Garante que não haja duplicatas
    pdFields.organization = pdFields.organization.filter(f => !f.key.includes(':'));
    pdFields.person = pdFields.person.filter(f => !f.key.includes(':'));
    pdFields.deal = pdFields.deal.filter(f => !f.key.includes(':'));

    pdFields.organization.push(
        { key: 'name:organization', name: 'Org: name (Padrão)' },
        { key: 'address:organization', name: 'Org: address (Padrão)' },
        { key: 'phone:organization', name: 'Org: phone (Padrão)' },
        { key: 'note:organization', name: 'Org: Observação (Padrão)' }
    );
    pdFields.person.push(
        { key: 'name:person', name: 'Pessoa: name (Padrão)' },
        { key: 'email:person', name: 'Pessoa: email (Padrão)' },
        { key: 'phone:person', name: 'Pessoa: phone (Padrão)' },
        { key: 'note:person', name: 'Pessoa: Observação (Padrão)' }
    );
    pdFields.deal.push(
        { key: 'title:deal', name: 'Negócio: title (Padrão)' },
        { key: 'value:deal', name: 'Negócio: value (Padrão)' },
        { key: 'note:deal', name: 'Negócio: Observação (Padrão)' }
    );
}

// --- CHAMADA DE API ---
async function pipedriveApiCall(endpoint, method = 'GET', body = null) {
    if (!BASE_URL) throw new Error('BASE_URL não definida.');
    
    let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}api_token=${API_KEY}`;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
    }

    // Usando um proxy CORS
    const proxy = 'https://corsproxy.io/?';
    const proxiedUrl = proxy + encodeURIComponent(url);

    try {
        const response = await fetch(proxiedUrl, options);

        if (!response.ok) {
            let errorText = `Erro ${response.status}`;
            try {
                const err = await response.json();
                errorText = `Erro API (${response.status}): ${err.error || err.message || 'Desconhecido'}`;
            } catch (jsonError) {
                try {
                    const textErr = await response.text();
                    errorText = `Erro API (${response.status}): ${textErr.substring(0, 150)}...`;
                } catch (e) {
                    errorText = `Erro API (${response.status}) - Não foi possível ler a resposta.`;
                }
            }
            throw new Error(errorText);
        }

        if (method === 'DELETE' && (response.status === 204 || response.status === 200)) {
            return { success: true };
        }

        const text = await response.text();
        if (!text) {
            return { success: true, data: null }; // Resposta vazia, mas OK
        }
        
        try {
            return JSON.parse(text); // Retorna o JSON completo
        } catch (parseError) {
            throw new Error(`Erro ao parsear JSON da API: ${parseError.message}. Resposta: ${text.substring(0, 100)}...`);
        }

    } catch (fetchError) {
        throw fetchError; // Re-throw o erro para ser pego pela função que chamou
    }
}


// --- INICIALIZAÇÃO ---
async function fetchInitialData() {
    dom.connectApiBtn.disabled = true;
    dom.apiLoader.classList.remove('hidden');
    hideApiMessage();

    API_KEY = dom.apiTokenInput.value;
    let companyDomain = dom.companyDomainInput.value;

    if (!API_KEY || !companyDomain) {
        showApiMessage('Por favor, insira a API Key e o Domínio da Empresa.', 'error');
        dom.connectApiBtn.disabled = false;
        dom.apiLoader.classList.add('hidden');
        return;
    }

    // Limpa e valida o domínio
    try {
        if (companyDomain.includes('.')) {
            const urlString = companyDomain.startsWith('http') ? companyDomain : `https://${companyDomain}`;
            const url = new URL(urlString);
            const parts = url.hostname.split('.');
            if (parts.length > 1 && parts[0] !== 'www') {
                companyDomain = parts[0];
            } else {
                throw new Error("Domínio inválido.");
            }
        }
        companyDomain = companyDomain.trim().replace(/[^a-zA-Z0-9-]/g, '');
        if (!companyDomain) throw new Error("Domínio inválido.");
        dom.companyDomainInput.value = companyDomain; // Atualiza input
    } catch (e) {
        const errorMsg = `Domínio da Empresa inválido. Insira apenas o subdomínio (ex: "suaempresa").`;
        showApiMessage(errorMsg, 'error');
        dom.connectApiBtn.disabled = false;
        dom.apiLoader.classList.add('hidden');
        return;
    }

    BASE_URL = `https://${companyDomain}.pipedrive.com/api/v1`;

    try {
        // Carrega dados iniciais em paralelo
        const [usersRes, pipelinesRes, orgFieldsRes, personFieldsRes, dealFieldsRes, permRes, activityTypesRes] = await Promise.all([
            pipedriveApiCall('/users?limit=500'),
            pipedriveApiCall('/pipelines?limit=500'),
            pipedriveApiCall('/organizationFields?limit=500'),
            pipedriveApiCall('/personFields?limit=500'),
            pipedriveApiCall('/dealFields?limit=500'),
            pipedriveApiCall('/permissionSets?limit=500'),
            pipedriveApiCall('/activityTypes?limit=500')
        ]);

        // Processa dados
        pdUsers = (usersRes.data || []).filter(u => u.active_flag);
        pdPipelines = (pipelinesRes.data || []);
        pdFields.organization = (orgFieldsRes.data || []).map(f => ({ key: f.key, name: `Org: ${f.name}` }));
        pdFields.person = (personFieldsRes.data || []).map(f => ({ key: f.key, name: `Pessoa: ${f.name}` }));
        pdFields.deal = (dealFieldsRes.data || []).map(f => ({ key: f.key, name: `Negócio: ${f.name}` }));
        pdPermissionSets = (permRes.data || []);
        pdActivityTypes = (activityTypesRes.data || []);
        
        addDefaultFields(); // Adiciona campos padrão (name, email, etc.)
        loadVerticalRules(); // Carrega regras salvas no localStorage

        // Popula selects e abas
        populateUserSelects(pdUsers);
        populatePipelineSelect(pdPipelines);
        populateVerticalsTab(pdUsers);

        // Inicializa os Choices.js para os selects
        initChoices(dom.pipelineSelect);
        initChoices(dom.stageSelect);
        initChoices(dom.defaultUserSelect);
        initChoices(dom.verticalRuleColumnSelect);

        showApiMessage('Conectado com sucesso!', 'success');
        
        // Esconde a conexão e mostra o app
        dom.apiConnectSection.classList.add('hidden');
        dom.mainContent.classList.remove('hidden');

    } catch (e) {
        console.error(e);
        showApiMessage(`Falha ao carregar dados: ${e.message}. Verifique a API Key e o Domínio.`, 'error');
        dom.connectApiBtn.disabled = false;
        dom.apiLoader.classList.add('hidden');
    }
}

// --- LÓGICA DAS ABAS ---
function setupTabs() {
    dom.tabs.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            dom.tabs.forEach(btn => btn.classList.remove('active'));
            dom.tabsContent.forEach(content => content.classList.add('hidden'));
            
            tabButton.classList.add('active');
            const tabId = tabButton.id.replace('tab-btn-', 'tab-');
            document.getElementById(tabId).classList.remove('hidden');

            if (tabId === 'tab-admin') {
                loadActiveAdminTab(); // Carrega o conteúdo da aba admin
            }
        });
    });
}

// --- LÓGICA DAS SUB-ABAS (IMPORTADOR) ---
function setupImporterSubTabs() {
    dom.importerSubTabs.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            dom.importerSubTabsContent.forEach(content => content.classList.add('hidden'));
            dom.importerSubTabs.forEach(btn => btn.classList.remove('active'));
            
            tabButton.classList.add('active');
            const subTabId = tabButton.id.replace('-btn-', '-');
            const el = document.getElementById(subTabId);
            if (el) el.classList.remove('hidden');
            
            if (subTabId === 'importer-subtab-history') {
                // TODO: Chamar função para carregar histórico
                // loadImportHistory(); 
            }
        });
    });
}


// --- LÓGICA DO IMPORTADOR (ETAPAS) ---

// Reseta o importador para o estado inicial
function resetImporter() {
    // Esconde todas as etapas exceto a 1
    [dom.step2Duplicates, dom.step2_5Adjustment, dom.step3Mapping, dom.step4Config, dom.step5Validation, dom.step6Log].forEach(el => el.classList.add('hidden'));
    dom.step1.classList.remove('hidden');

    // Limpa dados
    parsedData = [];
    columnHeaders = [];
    currentImportMapping = {};
    currentImportSettings = {};

    // Reseta campos
    dom.csvFileInput.value = '';
    dom.fileStatus.textContent = '';
    dom.filePreview.classList.add('hidden');
    dom.previewHeader.innerHTML = '';
    dom.previewBody.innerHTML = '';
    
    // Reseta logs
    dom.logContainer.innerHTML = '<p>Logs da importação aparecerão aqui...</p>';
    dom.duplicateLogContainer.innerHTML = '<p>Logs da verificação de duplicatas...</p>';
}

// Navegação entre etapas
function setupNavigation() {
    // Etapa 1 -> 2 (Automático no handleFileLoad)

    // Etapa 2 -> 2.5 ou 3 (Botão pós-verificação)
    dom.duplicateNextStepBtn.addEventListener('click', () => {
        const duplicates = JSON.parse(dom.duplicateNextStepBtn.dataset.duplicates || '[]');
        dom.duplicateNextStepContainer.classList.add('hidden'); // Esconde o botão
        
        if (duplicates.length > 0) {
            showDuplicateAdjustmentScreen(duplicates);
        } else {
            showMappingScreen();
        }
    });
    
    // Etapa 2.5 -> 3 (Pular)
    dom.adjustmentSkipBtn.addEventListener('click', () => {
        logToScreen(dom.duplicateLogContainer, 'Duplicatas ignoradas. Avançando para mapeamento dos leads restantes.', 'warn');
        showMappingScreen();
    });
    // Etapa 2.5 -> 3 (Processar)
    // dom.adjustmentProcessBtn.addEventListener('click', processDuplicateAdjustments); // TODO

    // Etapa 3 -> 4
    dom.nextToConfigBtn.addEventListener('click', () => {
        dom.step3Mapping.classList.add('hidden');
        dom.step4Config.classList.remove('hidden');
    });

    // Etapa 4 -> 3
    dom.backToMappingBtn.addEventListener('click', () => {
        dom.step4Config.classList.add('hidden');
        dom.step3Mapping.classList.remove('hidden');
    });
    
    // Etapa 4 -> 5
    dom.nextToValidationBtn.addEventListener('click', showValidationScreen);

    // Etapa 5 -> 4
    dom.validationBackBtn.addEventListener('click', () => {
        dom.step5Validation.classList.add('hidden');
        dom.step4Config.classList.remove('hidden');
    });

    // Etapa 5 -> 6 (Importação)
    dom.validationStartBtn.addEventListener('click', executeActualImport);

    // Etapa 6 -> 1
    dom.resetImporterBtn.addEventListener('click', resetImporter);
}

// ETAPA 1: Carregar Arquivo
function handleFileLoad() {
    const file = dom.csvFileInput.files[0];
    if (!file) { showGlobalMessage('Por favor, selecione um arquivo CSV ou XLSX.', 'error'); return; }
    hideGlobalMessage();
    
    dom.fileStatus.textContent = `Carregando arquivo: ${file.name}...`;

    if (file.name.endsWith('.csv')) {
        parseCsv(file);
    } else if (file.name.endsWith('.xlsx')) {
        parseXlsx(file);
    } else {
        const errorMsg = 'Formato inválido. Use .csv ou .xlsx.';
        dom.fileStatus.textContent = errorMsg;
        showGlobalMessage(errorMsg, 'error');
    }
}

function parseCsv(file) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => processParsedData(results.data, results.meta.fields),
        error: (err) => {
            const errorMsg = `Erro ao ler CSV: ${err.message}`;
            dom.fileStatus.textContent = errorMsg;
            showGlobalMessage(errorMsg, 'error');
        }
    });
}

function parseXlsx(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length === 0) throw new Error("Planilha vazia.");

            const headers = jsonData[0];
            const rows = XLSX.utils.sheet_to_json(worksheet); // Converte o resto para objetos
            
            processParsedData(rows, headers);
        } catch (err) {
            const errorMsg = `Erro ao ler XLSX: ${err.message}`;
            dom.fileStatus.textContent = errorMsg;
            showGlobalMessage(errorMsg, 'error');
        }
    };
    reader.onerror = (e) => {
        const errorMsg = `Erro no FileReader: ${e.message}`;
        dom.fileStatus.textContent = errorMsg;
        showGlobalMessage(errorMsg, 'error');
    };
    reader.readAsArrayBuffer(file);
}

function processParsedData(data, headers) {
    parsedData = data.filter(row => Object.values(row).some(val => val !== null && val !== '')); // Remove linhas totalmente vazias
    columnHeaders = headers.filter(h => h); // Remove cabeçalhos nulos

    dom.fileStatus.textContent = `Arquivo "${dom.csvFileInput.files[0].name}" carregado: ${parsedData.length} linhas encontradas.`;
    
    // Mostra preview
    dom.previewHeader.innerHTML = '';
    dom.previewBody.innerHTML = '';
    columnHeaders.forEach(h => dom.previewHeader.innerHTML += `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">${h}</th>`);
    
    const previewData = parsedData.slice(0, 5); // 5 linhas de preview
    previewData.forEach(row => {
        let tr = '<tr>';
        columnHeaders.forEach(h => tr += `<td class="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">${row[h] || ''}</td>`);
        tr += '</tr>';
        dom.previewBody.innerHTML += tr;
    });
    dom.filePreview.classList.remove('hidden');

    // Avança para a Etapa 2 (Duplicatas)
    dom.step1.classList.add('hidden');
    dom.step2Duplicates.classList.remove('hidden');
    runDuplicateCheck();
}

// ETAPA 2: Verificação de Duplicatas
async function runDuplicateCheck() {
    const log = (m, t = 'log') => logToScreen(dom.duplicateLogContainer, m, t);

    log('Iniciando verificação de duplicatas...', 'info');

    // 1. "Busca Automática" - Identifica colunas-chave da planilha
    let mappingGuess = {};
    columnHeaders.forEach(h => { mappingGuess[h] = guessMapping(h); });
    const findHeader = (key) => Object.keys(mappingGuess).find(k => mappingGuess[k] === key);

    // --- INÍCIO DA CORREÇÃO: Busca dinâmica de Chaves ---
    // Procura dinamicamente as chaves de CPF e CNPJ nos campos do Pipedrive
    const findPdFieldKey = (entity, ...names) => {
        const field = pdFields[entity].find(f => 
            names.some(n => f.name.toLowerCase().includes(n.toLowerCase()))
        );
        return field ? field.key : null;
    };

    // Tenta encontrar as chaves reais de CPF e CNPJ
    const CPF_KEY = findPdFieldKey('person', 'cpf');
    const CNPJ_KEY = findPdFieldKey('organization', 'cnpj');
    // --- FIM DA CORREÇÃO ---

    // Monta as chaves de busca dinamicamente
    const searchKeys = {
        'email:person': findHeader('email:person'),
        'phone:person': findHeader('phone:person'),
        'name:organization': findHeader('name:organization')
    };
    
    let cpfCol = 'N/A', cnpjCol = 'N/A';
    
    if (CPF_KEY) {
        // Tenta achar a coluna que o guessMapping encontrou para essa chave
        // Nota: guessMapping ainda vai usar a chave antiga, precisamos achar pelo NOME do campo
        const cpfHeader = Object.keys(mappingGuess).find(k => guessMapping(k).includes('8e10080613149524022cf363b811867c2d142d76')); // Acha a coluna pelo CPF antigo
        if(cpfHeader) {
            searchKeys[CPF_KEY] = cpfHeader;
            cpfCol = cpfHeader;
        }
    } else {
        log('Campo "CPF" (Pessoa) não encontrado no Pipedrive. Verificação de CPF será pulada.', 'warn');
    }

    if (CNPJ_KEY) {
        const cnpjHeader = Object.keys(mappingGuess).find(k => guessMapping(k).includes('96ff76d1e4c3b5b15b216963f413c6f240c5f513')); // Acha a coluna pelo CNPJ antigo
        if(cnpjHeader) {
            searchKeys[CNPJ_KEY] = cnpjHeader;
            cnpjCol = cnpjHeader;
        }
    } else {
        log('Campo "CNPJ" (Organização) não encontrado no Pipedrive. Verificação de CNPJ será pulada.', 'warn');
    }

    log('--- Colunas-Chave Identificadas (Busca Automática) ---', 'info');
    log(`Busca por Email (Pessoa) na coluna: ${searchKeys['email:person'] || 'N/A'}`);
    log(`Busca por Telefone (Pessoa) na coluna: ${searchKeys['phone:person'] || 'N/A'}`);
    log(`Busca por CPF (Pessoa) na coluna: ${cpfCol} (Chave API: ${CPF_KEY || 'N/A'})`);
    log(`Busca por Nome (Organização) na coluna: ${searchKeys['name:organization'] || 'N/A'}`);
    log(`Busca por CNPJ (Organização) na coluna: ${cnpjCol} (Chave API: ${CNPJ_KEY || 'N/A'})`);
    log('----------------------------------------------------', 'info');
    
    let duplicatesFound = [];
    let nonDuplicates = [];

    // 2. Loop de Verificação
    log('Iniciando busca na API...', 'info');
    dom.duplicateStatus.textContent = 'Verificando...';
    
    for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i];
        const progress = ((i + 1) / parsedData.length) * 100;
        dom.duplicateProgressBar.style.width = `${progress}%`;
        dom.duplicateProgressText.textContent = `Verificando linha ${i + 1} de ${parsedData.length}`;
        
        try {
            // Passa as chaves dinâmicas para a função de busca
            const duplicateResult = await searchDuplicate(row, searchKeys, CPF_KEY, CNPJ_KEY);
            
            if (duplicateResult) {
                duplicatesFound.push(duplicateResult);
                const matchTypes = duplicateResult.matches.map(m => (m.type || m.entity_type || 'item')).join(', ');
                log(`Linha ${i + 1}: Correspondência encontrada (${matchTypes})`, 'warn');
            } else {
                nonDuplicates.push(row);
            }
        } catch (error) {
            log(`Linha ${i + 1}: Erro na verificação - ${error.message}`, 'error');
            nonDuplicates.push(row); // Trata como não-duplicata se a busca falhar
        }
        
        await sleep(50); // Delay
    }

    // 3. Conclusão
    log(`Verificação concluída. ${duplicatesFound.length} linhas com duplicatas. ${nonDuplicates.length} novos leads.`, 'success');
    dom.duplicateLoader.classList.add('hidden');
    dom.duplicateStatus.textContent = 'Verificação Concluída!';

    // Atualiza a lista principal de dados. Apenas não-duplicatas seguirão para importação.
    parsedData = nonDuplicates; 

    // Mostra o botão de avançar
    dom.duplicateNextStepContainer.classList.remove('hidden');
    
    // Armazena o resultado para o botão usar
    dom.duplicateNextStepBtn.dataset.duplicates = JSON.stringify(duplicatesFound);
    
    if (duplicatesFound.length > 0) {
        log(`Clique em 'Próximo' para revisar as ${duplicatesFound.length} duplicatas.`, 'info');
        dom.duplicateNextStepBtn.textContent = 'Próximo: Revisar Duplicatas';
    } else {
        log('Nenhuma duplicata encontrada. Clique em \'Próximo\' para continuar.', 'info');
        dom.duplicateNextStepBtn.textContent = 'Próximo: Mapeamento';
    }
}

async function searchDuplicate(row, keys, cpfKey, cnpjKey) { // Recebe as chaves dinâmicas
    const promises = [];
    
    const addSearch = (col, endpoint, field, type) => {
        const value = row[col];
        // Adiciona verificação para 'field' não ser nulo
        if (col && value && field) { 
            promises.push(
                pipedriveApiCall(`${endpoint}?term=${encodeURIComponent(value)}&fields=${field}&exact_match=true&limit=1`)
                    .then(result => ({ ...result, searchType: type, searchTerm: value }))
            );
        }
    };

    // --- CORREÇÃO APLICADA ---
    // Campos Padrão
    addSearch(keys['email:person'], '/persons/search', 'email', 'Pessoa (Email)');
    addSearch(keys['phone:person'], '/persons/search', 'phone', 'Pessoa (Telefone)');
    addSearch(keys['name:organization'], '/organizations/search', 'name', 'Org (Nome)');
    
    // Campos Dinâmicos (CPF/CNPJ)
    // Usa as chaves reais (cpfKey, cnpjKey) e passa apenas o HASH para o 'field'
    if (cpfKey) {
        addSearch(keys[cpfKey], '/persons/search', cpfKey, 'Pessoa (CPF)');
    }
    if (cnpjKey) {
        addSearch(keys[cnpjKey], '/organizations/search', cnpjKey, 'Org (CNPJ)');
    }
    // --- FIM DA CORREÇÃO ---

    if (promises.length === 0) return null;

    const results = await Promise.allSettled(promises);
    
    const matches = [];
    results.forEach(r => {
        if (r.status === 'fulfilled' && r.value.data?.items?.length > 0) {
            const item = r.value.data.items[0].item;
            item.foundBy = `${r.value.searchType} = ${r.value.searchTerm}`;
            matches.push(item);
        }
    });

    if (matches.length > 0) {
        // Remove duplicatas internas (ex: achou a mesma pessoa por email e CPF)
        const uniqueMatches = Array.from(new Map(matches.map(item => [item.id, item])).values());
        return { rowData: row, matches: uniqueMatches };
    }
    return null;
}

// ETAPA 2.5: Ajuste de Duplicatas
function showDuplicateAdjustmentScreen(duplicates) {
    dom.step2Duplicates.classList.add('hidden');
    dom.step2_5Adjustment.classList.remove('hidden');
    
    dom.duplicateAdjustmentContainer.innerHTML = ''; // Limpa o container
    
    if (!duplicates || duplicates.length === 0) {
        dom.duplicateAdjustmentContainer.innerHTML = '<p class="text-gray-500">Nenhuma duplicata para revisar.</p>';
        return;
    }

    let html = `<p class="text-base font-medium text-gray-800 mb-4">${duplicates.length} linhas da planilha possuem correspondências:</p>`;
    
    const findHeader = (key) => {
        let mappingGuess = {};
        columnHeaders.forEach(h => { mappingGuess[h] = guessMapping(h); });
        return Object.keys(mappingGuess).find(k => mappingGuess[k] === key);
    };

    duplicates.forEach((dup, index) => {
        html += `<div class="p-4 border border-yellow-300 bg-yellow-50 rounded-lg space-y-3">`;
        html += `<h3 class="font-bold text-gray-900">Linha ${index + 1} (da sua planilha)</h3>`;
        
        // Mostra dados da planilha
        const orgHeader = findHeader('name:organization');
        const emailHeader = findHeader('email:person');
        html += `<div class="grid grid-cols-2 gap-1 text-sm">
            <strong class="text-gray-600">Org:</strong> <span class="truncate">${dup.rowData[orgHeader] || 'N/A'}</span>
            <strong class="text-gray-600">Email:</strong> <span class="truncate">${dup.rowData[emailHeader] || 'N/A'}</span>
        </div>`;
        
        html += `<h4 class="font-semibold text-gray-800 pt-2 border-t">Correspondências no Pipedrive:</h4>`;
        
        dup.matches.forEach(match => {
            const entityType = match.type || (match.entity_type === 'organization' ? 'ORG' : 'PESSOA');
            html += `<div class="p-2 border border-gray-200 rounded bg-white">`;
            html += `<p class="text-sm"><strong class="text-blue-600">${entityType}:</strong> ${match.name} (ID: ${match.id})</p>`;
            html += `<p class="text-xs text-gray-500">Encontrado por: ${match.foundBy}</p>`;
            html += `</div>`;
        });
        
        html += `</div>`;
    });
    
    html += `<p class="mt-4 text-red-600 font-medium">A interface de ajuste (Mesclar / Atualizar) ainda não foi implementada. Por enquanto, você pode pular estas duplicatas.</p>`;
    dom.duplicateAdjustmentContainer.innerHTML = html;
}

// ETAPA 3: Mapeamento
function showMappingScreen() {
    // Popula os selects da Etapa 3 e 4
    populateMappingSection(columnHeaders);
    populateVerticalColumnSelect(columnHeaders);

    // Esconde Etapas anteriores e mostra a 3
    dom.step2Duplicates.classList.add('hidden');
    dom.step2_5Adjustment.classList.add('hidden');
    dom.step3Mapping.classList.remove('hidden');
    dom.step4Config.classList.add('hidden'); // Garante que a 4 esteja oculta
}

function populateMappingSection(headers) {
    dom.mappingContainer.innerHTML = '';
    const allPdFields = [
        { key: 'ignore', name: 'Ignorar esta coluna' }, 
        ...pdFields.organization, 
        ...pdFields.person, 
        ...pdFields.deal
    ].sort((a, b) => a.name.localeCompare(b.name));

    // A optionsHtml não é mais necessária aqui, a lógica foi movida para dentro do loop

    headers.forEach(header => {
        // const guessedKey = guessMapping(header); // REMOVIDO (Req. 2)
        const fieldHtml = `
            <div class="grid grid-cols-2 gap-4 items-center p-3 border-b border-gray-200">
                <label class="text-sm font-medium text-gray-800 truncate" title="${header}">${header}</label>
                <div>
                    <select class="mapping-select block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" data-csv-header="${header}">
                        ${allPdFields.map(field => 
                            // Req. 2: Define 'Ignorar' como padrão
                            `<option value="${field.key}" ${field.key === 'ignore' ? 'selected' : ''}>${field.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>`;
        dom.mappingContainer.innerHTML += fieldHtml;
    });

    // Req. 1: Habilita a pesquisa nos selects
    document.querySelectorAll('.mapping-select').forEach(select => {
        initChoices(select);
    });
}

function guessMapping(header) {
    const h = header.toLowerCase().replace(/[^a-z0-9]/gi, '');
    if (h.includes('razaosocial')) return 'name:organization';
    if (h.includes('cnpj')) return '96ff76d1e4c3b5b15b216963f413c6f240c5f513:organization';
    if (h.includes('cnaeprincipal') && !h.includes('descricao')) return '34f0c609a3c10b2460b5f8e5f78c106d87e07e0c:organization';
    if (h.includes('descricaocnae')) return 'cnae_descricao'; // Assumindo que você tem esse campo
    if (h.includes('nomesocio') || h.includes('nomecontato')) return 'name:person';
    if (h.includes('emailsocio') || h.includes('emailcontato')) return 'email:person';
    if (h.includes('celularsocio') || h.includes('telefonecontato')) return 'phone:person';
    if (h.includes('cpfsocio')) return '8e10080613149524022cf363b811867c2d142d76:person';
    if (h.includes('valor')) return 'value:deal';
    if (h.includes('cep') || h.includes('cidade') || h.includes('estado')) return 'address:organization';
    return 'ignore';
}


// ETAPA 4: Configuração
function populateVerticalColumnSelect(headers) {
    const opts = [
        { value: '', label: 'Não usar regra de vertical', selected: true }, 
        ...headers.map(h => ({ value: h, label: h }))
    ];
    if (dom.verticalRuleColumnSelect.choicesInstance) {
        dom.verticalRuleColumnSelect.choicesInstance.enable();
        dom.verticalRuleColumnSelect.choicesInstance.setChoices(opts, 'value', 'label', true);
    }
}

function populateUserSelects(users) {
    const opts = [
        { value: '', label: 'Selecione usuário', selected: true, disabled: true },
        ...users.map(u => ({ value: u.id, label: u.name }))
    ];
    if (dom.defaultUserSelect.choicesInstance) {
        dom.defaultUserSelect.choicesInstance.setChoices(opts, 'value', 'label', true);
    } else {
        dom.defaultUserSelect.innerHTML = opts.map(o => `<option value="${o.value}" ${o.selected ? 'selected' : ''} ${o.disabled ? 'disabled' : ''}>${o.label}</option>`).join('');
    }
}

function populatePipelineSelect(pipelines) {
     const opts = [
        { value: '', label: 'Selecione Funil', selected: true, disabled: true },
        ...pipelines.map(p => ({ value: p.id, label: p.name }))
    ];
    if (dom.pipelineSelect.choicesInstance) {
        dom.pipelineSelect.choicesInstance.setChoices(opts, 'value', 'label', true);
    } else {
        dom.pipelineSelect.innerHTML = opts.map(o => `<option value="${o.value}" ${o.selected ? 'selected' : ''} ${o.disabled ? 'disabled' : ''}>${o.label}</option>`).join('');
    }
}

async function handlePipelineChange() {
    const pipelineId = dom.pipelineSelect.value;
    const stageChoices = dom.stageSelect.choicesInstance;

    if (!pipelineId) {
        if (stageChoices) { stageChoices.clearStore(); stageChoices.disable(); stageChoices.setChoices([{ value: '', label: 'Funil primeiro', selected: true, disabled: true }]); }
        return;
    }
    
    try {
        const rsp = await pipedriveApiCall(`/stages?pipeline_id=${pipelineId}`);
        pdStages = rsp.data || [];
        const opts = [
            { value: '', label: 'Selecione Etapa', selected: true, disabled: true }, 
            ...pdStages.map(s => ({ value: s.id, label: s.name }))
        ];
        if (stageChoices) { 
            stageChoices.enable(); 
            stageChoices.setChoices(opts, 'value', 'label', true); 
        } else {
            dom.stageSelect.innerHTML = opts.map(o => `<option value="${o.value}" ${o.selected ? 'selected' : ''} ${o.disabled ? 'disabled' : ''}>${o.label}</option>`).join('');
        }
    } catch (e) { 
        logToScreen(dom.logContainer, `Erro ao buscar etapas: ${e.message}`, 'error'); 
    }
}

function setupConfigLogic() {
    // Lógica dos radios de Deal
    dom.dealLogicRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const logicStatusEnabled = (document.querySelector('input[name="deal-logic"][value="create-if-status-is"]:checked') !== null);
            dom.dealLogicStatusOptions.classList.toggle('hidden', !logicStatusEnabled);
            
            const logicNotStatusEnabled = (document.querySelector('input[name="deal-logic"][value="create-if-status-is-not"]:checked') !== null);
            dom.dealLogicNotStatusOptions.classList.toggle('hidden', !logicNotStatusEnabled);
        });
    });
}


// ETAPA 5: Validação
function showValidationScreen() {
    hideGlobalMessage();
    
    // 1. Coletar Configurações
    const stageId = dom.stageSelect.value;
    const defaultUserId = dom.defaultUserSelect.value;
    const verticalRuleColumn = dom.verticalRuleColumnSelect.value;
    
    if (!stageId || !defaultUserId) { 
        showGlobalMessage('Selecione Funil, Etapa e Proprietário Padrão.', 'error'); 
        return; 
    }
    
    const mapping = {};
    document.querySelectorAll('.mapping-select').forEach(s => { 
        if (s.value !== 'ignore') mapping[s.getAttribute('data-csv-header')] = s.value; 
    });
    
    if (!Object.values(mapping).includes('name:organization') && !Object.values(mapping).includes('name:person')) { 
        showGlobalMessage('Mapeie pelo menos "Org: name" ou "Pessoa: name".', 'error'); 
        return; 
    }
    
    const dealLogic = document.querySelector('input[name="deal-logic"]:checked').value;
    let dealStatus = null;
    if (dealLogic === 'create-if-status-is') {
        dealStatus = document.querySelector('input[name="deal-status-choice"]:checked').value;
    } else if (dealLogic === 'create-if-status-is-not') {
        dealStatus = document.querySelector('input[name="deal-not-status-choice"]:checked').value;
    }

    // 2. Salvar Configurações Globalmente
    currentImportMapping = mapping;
    currentImportSettings = { 
        stageId, 
        defaultUserId, 
        verticalRuleColumn, 
        dealLogic, 
        dealStatus
    };

    // 3. Gerar Amostra de Tabela
    dom.validationSampleHeader.innerHTML = '';
    dom.validationSampleBody.innerHTML = '';

    let headersHtml = `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coluna Planilha</th>
                       <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Campo Pipedrive</th>`;
    
    const sampleData = parsedData.slice(0, 3);
    sampleData.forEach((row, index) => {
        headersHtml += `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Linha ${index + 1}</th>`;
    });
    dom.validationSampleHeader.innerHTML = `<tr>${headersHtml}</tr>`;

    let bodyHtml = '';
    for (const csvHeader in mapping) {
        const pdFieldKey = mapping[csvHeader];
        const pdField = [...pdFields.organization, ...pdFields.person, ...pdFields.deal].find(f => f.key === pdFieldKey);
        const pdFieldName = pdField ? pdField.name : pdFieldKey;
        
        bodyHtml += `<tr>
            <td class="px-4 py-3 text-sm font-medium text-gray-800">${csvHeader}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${pdFieldName}</td>`;
        
        sampleData.forEach(row => {
            bodyHtml += `<td class="px-4 py-3 text-sm text-gray-500">${row[csvHeader] || '<em>(vazio)</em>'}</td>`;
        });
        bodyHtml += `</tr>`;
    }
    dom.validationSampleBody.innerHTML = bodyHtml;

    // 4. Gerar Resumo das Configurações
    let summaryHTML = '';
    const pipelineName = dom.pipelineSelect.options[dom.pipelineSelect.selectedIndex]?.text || 'N/A';
    const stageName = dom.stageSelect.options[dom.stageSelect.selectedIndex]?.text || 'N/A';
    const defaultUserName = dom.defaultUserSelect.options[dom.defaultUserSelect.selectedIndex]?.text || 'N/A';
    
    summaryHTML += `<div><strong class="text-gray-600">Total de Linhas para Importar:</strong> ${parsedData.length}</div>`;
    summaryHTML += `<div><strong class="text-gray-600">Funil:</strong> ${pipelineName}</div>`;
    summaryHTML += `<div><strong class="text-gray-600">Etapa:</strong> ${stageName}</div>`;
    summaryHTML += `<div><strong class="text-gray-600">Proprietário Padrão:</strong> ${defaultUserName}</div>`;
    summaryHTML += `<div><strong class="text-gray-600">Coluna de Distribuição:</strong> ${verticalRuleColumn || 'Nenhuma'}</div>`;
    
    let logicText = 'N/A';
    const logicMap = {
        'create-open': 'Criar Negócio Aberto (Padrão)',
        'create-if-not-won-or-lost': "Criar Negócio SE não for 'Ganho' ou 'Perdido'",
        'create-if-status-is': `Criar Negócio APENAS SE status for: ${dealStatus}`,
        'create-if-status-is-not': `Criar Negócio APENAS SE status NÃO for: ${dealStatus}`
    };
    logicText = logicMap[dealLogic] || 'N/A';
    summaryHTML += `<div class="md:col-span-2"><strong class="text-gray-600">Lógica de Negócios:</strong> ${logicText}</div>`;
    
    dom.validationSettingsSummary.innerHTML = summaryHTML;

    // 5. Mostrar a Tela de Validação
    dom.step4Config.classList.add('hidden');
    dom.step5Validation.classList.remove('hidden');
}


// ETAPA 6: Executar Importação
async function executeActualImport() {
    dom.step5Validation.classList.add('hidden');
    dom.step6Log.classList.remove('hidden');
    
    const log = (m, t = 'log') => logToScreen(dom.logContainer, m, t);
    
    const mapping = currentImportMapping;
    const settings = currentImportSettings;

    log('--- Início da Importação ---', 'info');
    let successCount = 0;
    const total = parsedData.length;
    
    dom.importLoader.classList.remove('hidden');
    dom.importStatus.textContent = 'Processando...';
    dom.validationStartBtn.disabled = true;
    dom.validationBackBtn.disabled = true;
    
    for (let i = 0; i < total; i++) {
        const row = parsedData[i];
        const rowNum = i + 1;
        const progress = (rowNum / total) * 100;
        
        dom.progressBar.style.width = `${progress}%`; 
        dom.progressText.textContent = `Processando ${rowNum} de ${total}`;
        
        try { 
            await processRow(row, mapping, settings); 
            successCount++; 
            log(`[${rowNum}/${total}] OK.`, 'success'); 
        } 
        catch (e) { 
            log(`[${rowNum}/${total}] FALHA: ${e.message}`, 'error'); 
            console.error(`Erro Linha ${rowNum}:`, e, row); 
        }
        await sleep(200); // Rate limit
    }
    
    log(`--- Importação Concluída ---`, 'info');
    log(`Sucesso: ${successCount}/${total}.`, 'success');
    dom.importLoader.classList.add('hidden'); 
    dom.importStatus.textContent = 'Concluído!';
    
    dom.validationStartBtn.disabled = false; 
    dom.validationBackBtn.disabled = false;
    
    // TODO: Ponto 8 - Salvar no histórico
}

async function processRow(row, mapping, settings) {
    const { 
        stageId, defaultUserId, verticalRuleColumn, dealLogic, dealStatus 
    } = settings;
    
    const payloads = { organization: {}, person: {}, deal: {}, notes: { organization: null, person: null, deal: null } };
    
    // Preenche os payloads
    for (const csvHeader in mapping) {
        const pdKey = mapping[csvHeader];
        const value = row[csvHeader];
        if (value !== undefined && value !== null && value !== '') {
            const [key, entity] = pdKey.split(':');
            if (key === 'note') payloads.notes[entity] = String(value);
            else if (entity) payloads[entity][key] = String(value);
        }
    }

    // 1. Achar/Criar Organização
    if (!payloads.organization['name'] && !payloads.person['name']) throw new Error('Nome da Organização ou Pessoa é obrigatório.');
    
    let orgId = null;
    if (payloads.organization['name']) {
        const cnpjKey = Object.keys(payloads.organization).find(k => k.startsWith('96ff76d1e4c3b5b15b216963f413c6f240c5f513')); // CNPJ Key
        if(cnpjKey && payloads.organization[cnpjKey]) {
            orgId = await findEntity('/organizations/search', payloads.organization[cnpjKey], 'custom_fields.' + cnpjKey);
        }
        if (!orgId) {
            orgId = await findEntity('/organizations/search', payloads.organization['name'], 'name');
        }
        
        if (orgId) {
            logToScreen(dom.logContainer, `Org encontrada: ${payloads.organization['name']} (${orgId})`);
            // TODO: Atualizar Org?
        } else {
            const r = await pipedriveApiCall('/organizations', 'POST', payloads.organization);
            orgId = r.data.id;
            logToScreen(dom.logContainer, `Org criada: ${payloads.organization['name']} (${orgId})`);
        }
        if (payloads.notes.organization) await createNote(payloads.notes.organization, { org_id: orgId });
    }

    // 2. Achar/Criar Pessoa
    if (!payloads.person['name']) throw new Error('Pessoa: name vazio.');
    
    if (orgId) payloads.person.org_id = orgId;
    
    const cpfKey = Object.keys(payloads.person).find(k => k.startsWith('8e10080613149524022cf363b811867c2d142d76')); // CPF Key
    let personId = null;
    
    if(cpfKey && payloads.person[cpfKey]) {
        personId = await findEntity('/persons/search', payloads.person[cpfKey], 'custom_fields.' + cpfKey);
    }
    if (!personId) {
         personId = await findEntity('/persons/search', payloads.person['name'], 'name'); // Busca por nome
    }
    
    if (personId) {
        logToScreen(dom.logContainer, `Pessoa encontrada: ${payloads.person['name']} (${personId})`);
        // TODO: Atualizar Pessoa?
    } else {
        const r = await pipedriveApiCall('/persons', 'POST', payloads.person);
        personId = r.data.id;
        logToScreen(dom.logContainer, `Pessoa criada: ${payloads.person['name']} (${personId})`);
    }
    if (payloads.notes.person) await createNote(payloads.notes.person, { person_id: personId });

    // 3. Lógica de Criação de Negócio
    const rowStatus = payloads.deal.status ? payloads.deal.status.toLowerCase() : 'open';

    if (dealLogic === 'create-if-not-won-or-lost' && (rowStatus === 'won' || rowStatus === 'lost')) {
        throw new Error(`Ignorado: Lógica "não criar se Ganho ou Perdido" e status da linha é ${rowStatus}.`);
    }
    if (dealLogic === 'create-if-status-is' && rowStatus !== dealStatus) {
        throw new Error(`Ignorado: Lógica "criar APENAS SE status for ${dealStatus}" e status da linha é ${rowStatus}.`);
    }
    if (dealLogic === 'create-if-status-is-not' && rowStatus === dealStatus) {
        throw new Error(`Ignorado: Lógica "NÃO criar se status for ${dealStatus}" e status da linha é ${rowStatus}.`);
    }

    // 4. Atribuir Usuário (Distribuição Vertical)
    let userId = null;
    let reason = 'Não definido';
    const verticalValue = verticalRuleColumn ? String(row[verticalRuleColumn] || '').trim() : '';
    
    if (verticalValue) {
        const normVert = (v) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/gi, '');
        const verticalNorm = normVert(verticalValue);
        
        for (const uid in distributionRules) { 
            const verts = distributionRules[uid] || []; 
            if (verts.map(normVert).includes(verticalNorm)) { 
                userId = uid; 
                const name = pdUsers.find(u => u.id == uid)?.name || `ID ${uid}`; 
                reason = `Vertical '${verticalValue}' -> ${name}`; 
                break; 
            } 
        }
    }
    
    if (!userId) { 
        userId = defaultUserId; 
        reason = `Fallback Padrão`; 
    } 
    logToScreen(dom.logContainer, `Atribuindo (Motivo: ${reason})`, 'info');
    
    // 5. Criar Negócio
    payloads.deal.title = payloads.deal.title || `Negócio ${payloads.person['name'] || payloads.organization['name']}`;
    payloads.deal.org_id = orgId; 
    payloads.deal.person_id = personId; 
    payloads.deal.user_id = userId; 
    payloads.deal.stage_id = stageId;
    
    // Define o status do negócio (won, lost, open)
    if (rowStatus === 'won' || rowStatus === 'lost') {
        payloads.deal.status = rowStatus;
    } else {
        payloads.deal.status = 'open'; // Padrão
    }

    const r = await pipedriveApiCall('/deals', 'POST', payloads.deal);
    logToScreen(dom.logContainer, `Negócio criado: ${r.data.title} (${r.data.id})`);
    if (payloads.notes.deal) await createNote(payloads.notes.deal, { deal_id: r.data.id });
}

async function findEntity(endpoint, term, field = 'name') {
    if (!term) return null;
    const r = await pipedriveApiCall(`${endpoint}?term=${encodeURIComponent(term)}&fields=${field}&exact_match=true&limit=1`);
    return r.data?.items?.[0]?.item?.id || null;
}

async function createNote(content, links) { 
    await pipedriveApiCall('/notes', 'POST', { content: content, ...links }); 
}


// --- LÓGICA DA ABA "GESTÃO DE VERTICAIS" ---
function loadVerticalRules() {
    const savedRules = localStorage.getItem('pipedrive_verticals');
    if (savedRules) {
        distributionRules = JSON.parse(savedRules);
    } else {
        distributionRules = {}; 
    }
}

function populateVerticalsTab(users) {
    dom.verticalsContainer.innerHTML = '';
    
    users.forEach(user => {
        const userSelectedVerticals = distributionRules[user.id] || [];
        const wrapper = document.createElement('div');
        wrapper.className = 'p-4 border border-gray-200 rounded-lg bg-white';
        
        const label = document.createElement('label');
        label.className = 'block text-sm font-medium text-gray-700 mb-2';
        label.textContent = `Verticais para: ${user.name}`;
        wrapper.appendChild(label);
        
        const select = document.createElement('select');
        select.multiple = true;
        select.className = 'vertical-rules-select'; 
        select.setAttribute('data-user-id', user.id);
        
        FIXED_VERTICALS.forEach(v => {
            const option = document.createElement('option');
            option.value = v;
            option.textContent = v;
            if (userSelectedVerticals.includes(v)) { 
                option.selected = true; 
            }
            select.appendChild(option);
        });
        
        wrapper.appendChild(select);
        dom.verticalsContainer.appendChild(wrapper);
        initChoices(select, { removeItemButton: true }); 
    });
}

function saveVerticalRules() {
    const selects = document.querySelectorAll('.vertical-rules-select');
    let newRules = {};
    selects.forEach(selectEl => {
        const userId = selectEl.getAttribute('data-user-id');
        const choicesInstance = selectEl.choicesInstance;
        if (choicesInstance) { 
            newRules[userId] = choicesInstance.getValue(true); 
        }
    });
    
    distributionRules = newRules;
    localStorage.setItem('pipedrive_verticals', JSON.stringify(distributionRules));
    
    dom.verticalsMessage.className = 'p-4 rounded-lg bg-green-100 border-green-300 text-green-700';
    dom.verticalsMessage.textContent = 'Regras salvas com sucesso!';
    dom.verticalsMessage.classList.remove('hidden');
    setTimeout(() => dom.verticalsMessage.classList.add('hidden'), 3000);
}


// --- LÓGICA DA ABA ADMIN ---
let currentAdminPipelineId = null, currentAdminFieldEntity = 'person', fieldOptionsTagify = null;

function setupAdminTabs() { 
    dom.adminTabs.forEach(b => b.addEventListener('click', (e) => setActiveAdminTab(e.currentTarget.id.replace('admin-tab-btn-', '')))); 
    dom.adminTabsSelect.addEventListener('change', (e) => setActiveAdminTab(e.currentTarget.value.replace('-view', '')));
}
function setActiveAdminTab(id) { 
    dom.adminTabs.forEach(b => b.classList.toggle('active', b.id === `admin-tab-btn-${id}`)); 
    dom.adminTabsSelect.value = `admin-${id}-view`; 
    dom.adminTabsContent.querySelectorAll(':scope > div').forEach(c => c.classList.add('hidden')); 
    document.getElementById(`admin-${id}-view`).classList.remove('hidden'); 
    loadActiveAdminTab(id); 
}
function loadActiveAdminTab(id = null) { 
    if (!id) id = dom.adminTabsSelect.value.replace('admin-', '').replace('-view', ''); 
    hideAdminMessage(); 
    switch(id) { 
        case 'pipelines': 
            dom.adminStagesView.classList.add('hidden'); 
            dom.adminPipelinesView.classList.remove('hidden'); 
            loadPipelinesAdmin(); 
            break; 
        case 'products': loadProductsAdmin(); break; 
        case 'activity-types': loadActivityTypesAdmin(); break; 
        case 'fields': loadFieldsAdmin(); break; 
        case 'users': loadUsersAdmin(); break; 
    } 
}
function createFormField(id, lbl, type='text', val='', opts=null, req=true) { 
    let h = `<div class="mb-4" id="${id}-wrapper"><label for="${id}" class="block text-sm font-medium text-gray-700">${lbl}</label>`; 
    if (type === 'select') { 
        h += `<select id="${id}" name="${id}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" ${req ? 'required' : ''}>`; 
        if (opts) opts.forEach(o => h += `<option value="${o.value}" ${o.value == val ? 'selected' : ''}>${o.label}</option>`); 
        h += `</select>`; 
    } else if (type === 'checkbox') {
        h += `<div class="mt-2"><input type="checkbox" id="${id}" name="${id}" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" ${val ? 'checked' : ''}></div>`; 
    } else if (type === 'tagify') {
        h += `<input type="text" id="${id}" name="${id}" value="${val}" class="mt-1 block w-full" ${req ? 'required' : ''}>`; 
    } else if (type === 'icon_select') { 
        h += `<select id="${id}" name="${id}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" ${req ? 'required' : ''}><option value="">Selecione</option>`; 
        ACTIVITY_ICONS.forEach(i => h += `<option value="${i}" ${i === val ? 'selected' : ''}>${i}</option>`); 
        h += `</select>`; 
    } else {
        h += `<input type="${type}" id="${id}" name="${id}" value="${val}" ${type === 'number' ? 'step="0.01"' : ''} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" ${req ? 'required' : ''} ${opts?.readonly ? 'readonly' : ''}>`; 
    }
    h += `</div>`; return h; 
}
async function loadPipelinesAdmin() { 
    dom.adminPipelinesLoader.classList.remove('hidden'); 
    dom.adminPipelinesTableBody.innerHTML = ''; 
    try { 
        const r = await pipedriveApiCall('/pipelines'); 
        renderPipelinesTable(r.data || []); 
    } catch (e) { 
        showAdminMessage(`Erro funis: ${e.message}`, 'error'); 
    } finally { 
        dom.adminPipelinesLoader.classList.add('hidden'); 
    } 
}
function renderPipelinesTable(d) { 
    let t = ''; 
    if (d.length === 0) t = `<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">Nenhum funil.</td></tr>`; 
    d.forEach(p => t += `<tr><td class="px-6 py-4 text-sm font-medium text-gray-900">${p.name}</td><td class="px-6 py-4 text-sm text-gray-500">${p.active ? 'Sim' : 'Não'}</td><td class="px-6 py-4 text-right text-sm font-medium space-x-2"><button class="text-green-600 hover:text-green-900" onclick="loadStagesAdmin(${p.id}, '${p.name.replace(/'/g, "\\'")}')">Etapas</button><button class="text-indigo-600 hover:text-indigo-900" onclick="openPipelineModal(${JSON.stringify(p).replace(/"/g, "'")})">Editar</button><button class="text-red-600 hover:text-red-900" onclick="deletePipeline(${p.id}, '${p.name.replace(/'/g, "\\'")}')">Excluir</button></td></tr>`); 
    dom.adminPipelinesTableBody.innerHTML = t; 
}
function openPipelineModal(p=null) { 
    const edit=p!==null; 
    dom.adminModalTitle.textContent=edit?`Editar Funil: ${p.name}`:'Novo Funil'; 
    dom.adminModalBody.innerHTML=createFormField('inp-name','Nome','text',edit?p.name:'')+createFormField('inp-active','Ativo','checkbox',edit?p.active:true,null,false); 
    dom.adminModalForm.onsubmit=(e)=>{e.preventDefault(); const d={name:e.target['inp-name'].value,active:e.target['inp-active'].checked}; savePipeline(d,edit?p.id:null);}; 
    dom.adminModal.classList.remove('hidden'); 
}
async function savePipeline(d,id) { 
    try { 
        if (id) await pipedriveApiCall(`/pipelines/${id}`,'PUT',d); 
        else await pipedriveApiCall('/pipelines','POST',d); 
        showAdminMessage(`Funil ${id?'atualizado':'criado'}!`, 'success'); 
        dom.adminModal.classList.add('hidden'); 
        loadPipelinesAdmin(); 
    } catch (e) { 
        showAdminMessage(`Erro funil: ${e.message}`, 'error'); 
    } 
}
function deletePipeline(id,n) { 
    openConfirmModal(`Excluir ${n}`, `Certeza?`, async ()=>{ 
        try { 
            await pipedriveApiCall(`/pipelines/${id}`,'DELETE'); 
            showAdminMessage('Excluído!', 'success'); 
            loadPipelinesAdmin(); 
        } catch (e) { 
            showAdminMessage(`Erro excluir: ${e.message}`, 'error'); 
        } 
    }); 
}
async function loadStagesAdmin(pid, pname) { 
    currentAdminPipelineId=pid; 
    dom.adminAddStageBtn.dataset.pipelineId=pid; 
    dom.adminPipelinesView.classList.add('hidden'); 
    dom.adminStagesView.classList.remove('hidden'); 
    dom.adminStagesTitle.textContent=`Etapas: ${pname}`; 
    dom.adminStagesLoader.classList.remove('hidden'); 
    dom.adminStagesTableBody.innerHTML=''; 
    try { 
        const r=await pipedriveApiCall(`/stages?pipeline_id=${pid}`); 
        renderStagesTable(r.data||[], pid); 
    } catch (e) { 
        showAdminMessage(`Erro etapas: ${e.message}`, 'error'); 
    } finally { 
        dom.adminStagesLoader.classList.add('hidden'); 
    } 
}
function renderStagesTable(d, pid) { 
    let t=''; 
    if(d.length===0)t=`<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Nenhuma etapa.</td></tr>`; 
    d.sort((a,b)=>a.order_nr-b.order_nr).forEach(s=>t+=`<tr><td class="px-6 py-4 text-sm font-medium text-gray-900">${s.name}</td><td class="px-6 py-4 text-sm text-gray-500">${s.deal_probability}%</td><td class="px-6 py-4 text-sm text-gray-500">${s.deals_count}</td><td class="px-6 py-4 text-right text-sm font-medium space-x-2"><button class="text-indigo-600 hover:text-indigo-900" onclick="openStageModal(${JSON.stringify(s).replace(/"/g, "'")}, ${pid})">Editar</button><button class="text-red-600 hover:text-red-900" onclick="deleteStage(${s.id}, '${s.name.replace(/'/g, "\\'")}', ${pid})">Excluir</button></td></tr>`); 
    dom.adminStagesTableBody.innerHTML=t; 
}
function openStageModal(s=null, pid) { 
    const edit=s!==null; 
    dom.adminModalTitle.textContent=edit?`Editar Etapa: ${s.name}`:'Nova Etapa'; 
    dom.adminModalBody.innerHTML=createFormField('inp-name','Nome','text',edit?s.name:'')+createFormField('inp-pid','Funil ID','hidden',pid)+createFormField('inp-prob','Probabilidade (%)','number',edit?s.deal_probability:'100')+createFormField('inp-order','Ordem','number',edit?s.order_nr:'',null,false); 
    dom.adminModalForm.onsubmit=(e)=>{e.preventDefault(); const d={name:e.target['inp-name'].value,pipeline_id:parseInt(e.target['inp-pid'].value), deal_probability:parseInt(e.target['inp-prob'].value)}; const o=e.target['inp-order'].value; if(o)d.order_nr=parseInt(o); saveStage(d,edit?s.id:null, pid);}; 
    dom.adminModal.classList.remove('hidden'); 
}
async function saveStage(d,id,pid) { 
    try { 
        if(id){delete d.pipeline_id; await pipedriveApiCall(`/stages/${id}`,'PUT',d);} 
        else await pipedriveApiCall('/stages','POST',d); 
        showAdminMessage(`Etapa ${id?'atualizada':'criada'}!`, 'success'); 
        dom.adminModal.classList.add('hidden'); 
        loadStagesAdmin(pid, dom.adminStagesTitle.textContent.replace('Etapas: ','')); 
    } catch (e) { 
        showAdminMessage(`Erro etapa: ${e.message}`, 'error'); 
    } 
}
function deleteStage(id,n,pid) { 
    openConfirmModal(`Excluir ${n}`, `Certeza?`, async ()=>{ 
        try { 
            await pipedriveApiCall(`/stages/${id}`,'DELETE'); 
            showAdminMessage('Excluída!', 'success'); 
            loadStagesAdmin(pid, dom.adminStagesTitle.textContent.replace('Etapas: ','')); 
        } catch (e) { 
            showAdminMessage(`Erro excluir: ${e.message}`, 'error'); 
        } 
    }); 
}
async function loadProductsAdmin() { 
    dom.adminProductsLoader.classList.remove('hidden'); 
    dom.adminProductsTableBody.innerHTML=''; 
    try { 
        const r=await pipedriveApiCall('/products?limit=500'); 
        renderProductsTable(r.data||[]); 
    } catch (e) { 
        showAdminMessage(`Erro produtos: ${e.message}`, 'error'); 
    } finally { 
        dom.adminProductsLoader.classList.add('hidden'); 
    } 
}
function renderProductsTable(d) { 
    let t=''; 
    if(d.length===0)t=`<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhum produto.</td></tr>`; 
    d.forEach(p=>{const price=p.prices.find(pr=>pr.is_default), priceStr=price?`${price.price} ${price.currency}`:'N/A'; t+=`<tr><td class="px-6 py-4 text-sm font-medium text-gray-900">${p.name}</td><td class="px-6 py-4 text-sm text-gray-500">${p.code||''}</td><td class="px-6 py-4 text-sm text-gray-500">${priceStr}</td><td class="px-6 py-4 text-sm text-gray-500">${p.active_flag?'Sim':'Não'}</td><td class="px-6 py-4 text-right text-sm font-medium space-x-2"><button class="text-indigo-600 hover:text-indigo-900" onclick="openProductModal(${JSON.stringify(p).replace(/"/g, "'")})">Editar</button><button class="text-red-600 hover:text-red-900" onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')">Excluir</button></td></tr>`}); 
    dom.adminProductsTableBody.innerHTML=t; 
}
function openProductModal(p=null) { 
    const edit=p!==null; 
    dom.adminModalTitle.textContent=edit?`Editar Produto: ${p.name}`:'Novo Produto'; 
    const price=edit?(p.prices.find(pr=>pr.is_default)||{}):{}; 
    dom.adminModalBody.innerHTML=createFormField('inp-name','Nome','text',edit?p.name:'')+createFormField('inp-code','Código','text',edit?p.code:'',null,false)+createFormField('inp-price','Preço','number',price.price||'0.00')+createFormField('inp-curr','Moeda','text',price.currency||'BRL')+createFormField('inp-active','Ativo','checkbox',edit?p.active_flag:true,null,false); 
    dom.adminModalForm.onsubmit=(e)=>{e.preventDefault(); const d={name:e.target['inp-name'].value, code:e.target['inp-code'].value, active_flag:e.target['inp-active'].checked, prices:[{price:parseFloat(e.target['inp-price'].value), currency:e.target['inp-curr'].value, is_default:true}]}; saveProduct(d,edit?p.id:null);}; 
    dom.adminModal.classList.remove('hidden'); 
}
async function saveProduct(d,id) { 
    try { 
        if(id){delete d.prices; await pipedriveApiCall(`/products/${id}`,'PUT',d);} 
        else await pipedriveApiCall('/products','POST',d); 
        showAdminMessage(`Produto ${id?'atualizado':'criado'}!`, 'success'); 
        dom.adminModal.classList.add('hidden'); 
        loadProductsAdmin(); 
    } catch (e) { 
        showAdminMessage(`Erro produto: ${e.message}`, 'error'); 
    } 
}
function deleteProduct(id,n) { 
    openConfirmModal(`Excluir ${n}`, `Certeza?`, async ()=>{ 
        try { 
            await pipedriveApiCall(`/products/${id}`,'DELETE'); 
            showAdminMessage('Excluído!', 'success'); 
            loadProductsAdmin(); 
        } catch (e) { 
            showAdminMessage(`Erro excluir: ${e.message}`, 'error'); 
        } 
    }); 
}
async function loadActivityTypesAdmin() { 
    dom.adminActivityTypesLoader.classList.remove('hidden'); 
    dom.adminActivityTypesTableBody.innerHTML=''; 
    try { 
        renderActivityTypesTable(pdActivityTypes); 
    } catch (e) { 
        showAdminMessage(`Erro tipos atividade: ${e.message}`, 'error'); 
    } finally { 
        dom.adminActivityTypesLoader.classList.add('hidden'); 
    } 
}
function renderActivityTypesTable(d) { 
    let t=''; 
    if(d.length===0)t=`<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Nenhum tipo.</td></tr>`; 
    d.sort((a,b) => a.order_nr - b.order_nr).forEach(a=>{ 
        const status = a.active_flag ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>' : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inativo</span>';
        const toggleBtnText = a.active_flag ? 'Desativar' : 'Ativar';
        const toggleBtnColor = a.active_flag ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900';
        t+=`<tr><td class="px-6 py-4 text-sm font-medium text-gray-900">${a.name}</td><td class="px-6 py-4 text-sm text-gray-500">${a.icon_key}</td><td class="px-6 py-4 text-sm text-gray-500">${a.color || 'N/A'}</td><td class="px-6 py-4 text-right text-sm font-medium space-x-2"><button class="text-indigo-600 hover:text-indigo-900" onclick="openActivityTypeModal(${JSON.stringify(a).replace(/"/g, "'")})">Editar</button><button class="${toggleBtnColor}" onclick="toggleActivityTypeStatus(${JSON.stringify(a).replace(/"/g, "'")})">${toggleBtnText}</button></td></tr>`; 
    }); 
    dom.adminActivityTypesTableBody.innerHTML=t; 
}
function openActivityTypeModal(a=null) { 
    const edit=a!==null; 
    dom.adminModalTitle.textContent=edit?`Editar Tipo Atividade`:'Novo Tipo Atividade'; 
    dom.adminModalBody.innerHTML=createFormField('inp-name','Nome','text',edit?a.name:'') + 
        createFormField('inp-icon','Ícone','icon_select',edit?a.icon_key:'task') +
        createFormField('inp-color','Cor (hex)','text',edit?a.color:'',null,false) +
        createFormField('inp-active','Ativo','checkbox',edit?!edit ? true : a.active_flag:true,null,false); 
    dom.adminModalForm.onsubmit=(e)=>{
        e.preventDefault(); 
        const d={ name:e.target['inp-name'].value, icon_key:e.target['inp-icon'].value, active_flag: e.target['inp-active'].checked }; 
        if (e.target['inp-color'].value) d.color = e.target['inp-color'].value;
        saveActivityType(d,edit?a.id:null);
    }; 
    dom.adminModal.classList.remove('hidden'); 
}
async function saveActivityType(d,id) { 
    try { 
        if(id) await pipedriveApiCall(`/activityTypes/${id}`,'PUT',d); 
        else await pipedriveApiCall('/activityTypes','POST',d); 
        showAdminMessage(`Tipo ${id?'atualizado':'criado'}!`, 'success'); 
        dom.adminModal.classList.add('hidden'); 
        const r=await pipedriveApiCall('/activityTypes'); 
        pdActivityTypes=r.data||[]; 
        renderActivityTypesTable(pdActivityTypes); 
    } catch (e) { 
        showAdminMessage(`Erro tipo: ${e.message}`, 'error'); 
    } 
}
function toggleActivityTypeStatus(a) {
    const newStatus = !a.active_flag;
    const actionText = newStatus ? 'Ativar' : 'Desativar';
    openConfirmModal(`${actionText} ${a.name}`, `Tem certeza?`, async ()=>{ 
        try { 
            await pipedriveApiCall(`/activityTypes/${a.id}`,'PUT', { active_flag: newStatus }); 
            showAdminMessage(`Tipo de atividade "${a.name}" foi ${newStatus ? 'ativado' : 'desativado'}!`, 'success'); 
            const r = await pipedriveApiCall('/activityTypes'); 
            pdActivityTypes = r.data || []; 
            renderActivityTypesTable(pdActivityTypes); 
        } catch (e) { 
            showAdminMessage(`Erro ao ${actionText.toLowerCase()}: ${e.message}`, 'error'); 
        } 
    }); 
}
async function loadFieldsAdmin() { 
    currentAdminFieldEntity=dom.adminFieldEntitySelect.value; 
    dom.adminFieldsLoader.classList.remove('hidden'); 
    dom.adminFieldsTableBody.innerHTML=''; 
    try { 
        const r=await pipedriveApiCall(`/${currentAdminFieldEntity}Fields`); 
        renderFieldsTable(r.data||[]); 
    } catch (e) { 
        showAdminMessage(`Erro campos: ${e.message}`, 'error'); 
    } finally { 
        dom.adminFieldsLoader.classList.add('hidden'); 
    } 
}
function renderFieldsTable(d) { 
    let t=''; 
    if(d.length===0)t=`<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhum campo.</td></tr>`; 
    d.forEach(f=>t+=`<tr><td class="px-6 py-4 text-sm font-medium text-gray-900">${f.name}</td><td class="px-6 py-4 text-sm text-gray-500 font-mono">${f.key}</td><td class="px-6 py-4 text-sm text-gray-500">${f.field_type}</td><td class="px-6 py-4 text-sm text-gray-500">${f.active_flag?'Sim':'Não'}</td><td class="px-6 py-4 text-right text-sm font-medium space-x-2">${f.edit_flag?`<button class="text-indigo-600 hover:text-indigo-900" onclick="openFieldModal(${JSON.stringify(f).replace(/"/g, "'")})">Editar</button><button class="text-red-600 hover:text-red-900" onclick="deleteField(${f.id}, '${f.name.replace(/'/g, "\\'")}')">Excluir</button>`:'(Padrão)'}</td></tr>`); 
    dom.adminFieldsTableBody.innerHTML=t; 
}
function openFieldModal(f=null) { 
    const edit=f!==null; 
    dom.adminModalTitle.textContent=edit?`Editar Campo: ${f.name}`:`Novo Campo (${currentAdminFieldEntity})`; 
    const types=[{v:'varchar',l:'Texto'},{v:'text',l:'Texto Longo'},{v:'double',l:'Número'},{v:'monetary',l:'Monetário'},{v:'date',l:'Data'},{v:'address',l:'Endereço'},{v:'phone',l:'Telefone'},{v:'enum',l:'Seleção Única'},{v:'set',l:'Seleção Múltipla'},{v:'user',l:'Usuário'},{v:'organization',l:'Organização'},{v:'person',l:'Pessoa'}].map(o=>({value:o.v, label:o.l})); 
    const optsVal=edit&&(f.field_type==='enum'||f.field_type==='set')?(f.options||[]).map(o=>o.label).join(','):''; 
    dom.adminModalBody.innerHTML=createFormField('inp-name','Nome','text',edit?f.name:'')+createFormField('inp-type','Tipo','select',edit?f.field_type:'varchar',types,true)+createFormField('inp-opts','Opções (CSV)','tagify',optsVal,null,false); 
    const optsInp=document.getElementById('inp-opts'); 
    if(fieldOptionsTagify)fieldOptionsTagify.destroy(); 
    fieldOptionsTagify=new Tagify(optsInp); 
    const optsWrap=document.getElementById('inp-opts-wrapper'), typeSel=document.getElementById('inp-type'); 
    const toggleOpts=()=>{optsWrap.style.display=(typeSel.value==='enum'||typeSel.value==='set')?'block':'none';}; 
    typeSel.addEventListener('change',toggleOpts); 
    toggleOpts(); 
    if(edit)typeSel.disabled=true; 
    dom.adminModalForm.onsubmit=(e)=>{e.preventDefault(); const d={name:e.target['inp-name'].value, field_type:e.target['inp-type'].value}; if(d.field_type==='enum'||d.field_type==='set'){let opts=[]; try{opts=JSON.parse(e.target['inp-opts'].value).map(t=>({label:t.value}));} catch(ex){opts=(e.target['inp-opts'].value||'').split(',').map(l=>({label:l.trim()})).filter(o=>o.label);} d.options=opts;} saveField(d,edit?f.id:null);}; 
    dom.adminModal.classList.remove('hidden'); 
}
async function saveField(d,id) { 
    const ep=`/${currentAdminFieldEntity}Fields`; 
    try { 
        if(id){delete d.field_type; await pipedriveApiCall(`${ep}/${id}`,'PUT',d);} 
        else await pipedriveApiCall(ep,'POST',d); 
        showAdminMessage(`Campo ${id?'atualizado':'criado'}!`, 'success'); 
        dom.adminModal.classList.add('hidden'); 
        loadFieldsAdmin(); 
        // Recarrega os dados iniciais para atualizar os campos no importador
        fetchInitialData().catch(console.error); 
    } catch (e) { 
        showAdminMessage(`Erro campo: ${e.message}`, 'error'); 
    } 
}
function deleteField(id,n) { 
    openConfirmModal(`Excluir ${n}`, `Certeza?`, async ()=>{ 
        try { 
            await pipedriveApiCall(`/${currentAdminFieldEntity}Fields/${id}`,'DELETE'); 
            showAdminMessage('Excluído!', 'success'); 
            loadFieldsAdmin(); 
            fetchInitialData().catch(console.error); 
        } catch (e) { 
            showAdminMessage(`Erro excluir: ${e.message}`, 'error'); 
        } 
    }); 
}
async function loadUsersAdmin() { 
    dom.adminUsersLoader.classList.remove('hidden'); 
    dom.adminUsersTableBody.innerHTML=''; 
    try { 
        const r=await pipedriveApiCall('/users'); 
        renderUsersTable(r.data||[]); 
    } catch (e) { 
        showAdminMessage(`Erro usuários: ${e.message}`, 'error'); 
    } finally { 
        dom.adminUsersLoader.classList.add('hidden'); 
    } 
}
function renderUsersTable(d) { 
    let t=''; 
    if(d.length===0)t=`<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhum usuário.</td></tr>`; 
    d.forEach(u=>{
        const role=pdPermissionSets.find(p=>p.id===u.role_id)?.name||'N/A'; 
        const status=u.active_flag?'<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>':'<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inativo</span>'; 
        t+=`<tr><td class="px-6 py-4 text-sm font-medium text-gray-900">${u.name}</td><td class="px-6 py-4 text-sm text-gray-500">${u.email}</td><td class="px-6 py-4 text-sm text-gray-500">${role}</td><td class="px-6 py-4 text-sm text-gray-500">${status}</td><td class="px-6 py-4 text-right text-sm font-medium space-x-2"><button class="text-indigo-600 hover:text-indigo-900" onclick="openUserModal(${JSON.stringify(u).replace(/"/g, "'")})">Editar</button>${u.active_flag?`<button class="text-red-600 hover:text-red-900" onclick="deleteUser(${u.id}, '${u.name.replace(/'/g, "\\'")}')">Desativar</button>`:''}</td></tr>`}); 
    dom.adminUsersTableBody.innerHTML=t; 
}
function openUserModal(u=null) { 
    const edit=u!==null; 
    dom.adminModalTitle.textContent=edit?`Editar Usuário: ${u.name}`:'Convidar Usuário'; 
    const roles=pdPermissionSets.map(p=>({value:p.id, label:p.name})); 
    let body=createFormField('inp-name','Nome','text',edit?u.name:'')+createFormField('inp-email','Email','email',edit?u.email:'',{readonly:edit}); 
    if(edit){body+=createFormField('inp-role','Papel','select',edit?u.role_id:'',roles)+createFormField('inp-active','Ativo','checkbox',edit?u.active_flag:true,null,false);} 
    dom.adminModalBody.innerHTML=body; 
    dom.adminModalForm.onsubmit=(e)=>{e.preventDefault(); const d={name:e.target['inp-name'].value, email:e.target['inp-email'].value}; if(edit){d.role_id=parseInt(e.target['inp-role'].value); d.active_flag=e.target['inp-active'].checked;} saveUser(d,edit?u.id:null);}; 
    dom.adminModal.classList.remove('hidden'); 
}
async function saveUser(d,id) { 
    try { 
        if(id){delete d.email; await pipedriveApiCall(`/users/${id}`,'PUT',d);} 
        else await pipedriveApiCall('/users','POST',{email:d.email, name:d.name}); 
        showAdminMessage(`Usuário ${id?'atualizado':'convidado'}!`, 'success'); 
        dom.adminModal.classList.add('hidden'); 
        loadUsersAdmin(); 
        fetchInitialData().catch(console.error); 
    } catch (e) { 
        showAdminMessage(`Erro usuário: ${e.message}`, 'error'); 
    } 
}
function deleteUser(id,n) { 
    openConfirmModal(`Desativar ${n}`, `Certeza?`, async ()=>{ 
        try { 
            await pipedriveApiCall(`/users/${id}`,'PUT',{active_flag:false}); 
            showAdminMessage('Desativado!', 'success'); 
            loadUsersAdmin(); 
            fetchInitialData().catch(console.error); 
        } catch (e) { 
            showAdminMessage(`Erro desativar: ${e.message}`, 'error'); 
        } 
    }); 
}
function openConfirmModal(t,m,cb) { 
    dom.confirmModalTitle.textContent=t; 
    dom.confirmModalBody.innerHTML = `<p class="text-sm text-gray-500">${m}</p>`;
    // Clona o botão para remover listeners antigos
    const newConfirmBtn = dom.confirmModalConfirmBtn.cloneNode(true);
    dom.confirmModalConfirmBtn.parentNode.replaceChild(newConfirmBtn, dom.confirmModalConfirmBtn);
    dom.confirmModalConfirmBtn = newConfirmBtn;
    
    dom.confirmModalConfirmBtn.addEventListener('click',()=>{cb(); dom.confirmModal.classList.add('hidden');}); 
    dom.confirmModal.classList.remove('hidden'); 
}
function showAdminMessage(m, type='success') { 
    const c={error:'bg-red-100 border-red-300 text-red-700',success:'bg-green-100 border-green-300 text-green-700'}; 
    dom.adminMessage.className=`p-4 rounded-lg mb-4 border ${c[type]||c.error}`; 
    dom.adminMessage.textContent=m; 
    dom.adminMessage.classList.remove('hidden'); 
    window.scrollTo(0,0); 
}
function hideAdminMessage() { 
    dom.adminMessage.classList.add('hidden'); 
    dom.adminMessage.textContent=''; 
}


// --- EVENT LISTENERS GLOBAIS ---
window.addEventListener('DOMContentLoaded', () => {
    // Ação principal: Ligar o botão de conexão
    dom.connectApiBtn.addEventListener('click', fetchInitialData);
    
    // Configura as abas
    setupTabs(); 
    setupAdminTabs(); 
    setupImporterSubTabs();
    setupNavigation();
    setupConfigLogic();

    // Listeners do Importador
    dom.loadCsvBtn.addEventListener('click', handleFileLoad);
    dom.pipelineSelect.addEventListener('change', handlePipelineChange);

    // Listeners da Aba Verticais
    dom.saveVerticalsBtn.addEventListener('click', saveVerticalRules);
    
    // Listeners da Aba Admin
    dom.adminAddPipelineBtn.addEventListener('click', () => openPipelineModal());
    dom.adminBackToPipelinesBtn.addEventListener('click', () => {
        dom.adminStagesView.classList.add('hidden');
        dom.adminPipelinesView.classList.remove('hidden');
    });
    dom.adminAddStageBtn.addEventListener('click', () => {
        const pipelineId = dom.adminAddStageBtn.dataset.pipelineId;
        openStageModal(null, pipelineId);
    });
    dom.adminAddProductBtn.addEventListener('click', () => openProductModal());
    dom.adminAddActivityTypeBtn.addEventListener('click', () => openActivityTypeModal());
    dom.adminFieldEntitySelect.addEventListener('change', () => loadFieldsAdmin());
    dom.adminAddFieldBtn.addEventListener('click', () => openFieldModal());
    dom.adminAddUserBtn.addEventListener('click', () => openUserModal());
    
    // Listeners Modais
    dom.adminModalCancelBtn.addEventListener('click', () => dom.adminModal.classList.add('hidden'));
    dom.confirmModalCancelBtn.addEventListener('click', () => dom.confirmModal.classList.add('hidden'));
});


