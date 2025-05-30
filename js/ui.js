class UI {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.currentCategory = Object.keys(this.dataManager.categories)[0];
    
    // UI elements
    this.categoriesTabs = document.getElementById('categoriesTabs');
    this.offensesLists = document.getElementById('offensesLists');
    this.selectedOffensesList = document.getElementById('selectedOffensesList');
    this.totalTimeElement = document.getElementById('totalTime');
    this.copyTextArea = document.getElementById('copyTextArea');
    this.copyBtn = document.getElementById('copyBtn');
    
    // Initialize UI
    this.initUI();
    this.setupEventListeners();
  }
  
  // Initialize UI elements
  initUI() {
    this.renderCategories();
    this.renderOffenses();
    this.updateResults();
  }
  
  // Setup event listeners
  setupEventListeners() {
    // Copy button
    this.copyBtn.addEventListener('click', () => {
      this.copyText();
    });
    
    // Category tabs clicks
    this.categoriesTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-tab')) {
        this.changeCategory(e.target.dataset.category);
      }
    });
    
    // Offense selection handling
    this.offensesLists.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const offenseId = e.target.dataset.id;
        const countInput = document.querySelector(`input[data-count-id="${offenseId}"]`);
        
        if (e.target.checked) {
          countInput.disabled = false;
          this.dataManager.selectOffense(offenseId, parseInt(countInput.value));
        } else {
          countInput.disabled = true;
          this.dataManager.unselectOffense(offenseId);
        }
        
        this.updateResults();
      } else if (e.target.type === 'number') {
        const offenseId = e.target.dataset.countId;
        const checkbox = document.querySelector(`input[data-id="${offenseId}"]`);
        
        if (checkbox.checked) {
          this.dataManager.selectOffense(offenseId, parseInt(e.target.value));
          this.updateResults();
        }
      }
    });
  }
  
  // Render category tabs
  renderCategories() {
    this.categoriesTabs.innerHTML = '';
    
    Object.entries(this.dataManager.categories).forEach(([id, name]) => {
      const tabElement = document.createElement('div');
      tabElement.className = `category-tab ${id === this.currentCategory ? 'active' : ''}`;
      tabElement.dataset.category = id;
      tabElement.textContent = name;
      
      this.categoriesTabs.appendChild(tabElement);
    });
  }
  
  // Render offenses lists for all categories
  renderOffenses() {
    this.offensesLists.innerHTML = '';
    
    Object.keys(this.dataManager.categories).forEach(categoryId => {
      const offensesListElement = document.createElement('div');
      offensesListElement.className = `offenses-list ${categoryId === this.currentCategory ? 'active' : ''}`;
      offensesListElement.dataset.category = categoryId;
      
      const offenses = this.dataManager.getCategoryOffenses(categoryId);
      
      if (offenses.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Không có tội danh nào trong danh mục này';
        offensesListElement.appendChild(emptyMessage);
      } else {
        offenses.forEach(offense => {
          const isSelected = this.dataManager.selectedOffenses[offense.id] !== undefined;
          const count = isSelected ? this.dataManager.selectedOffenses[offense.id] : 1;
          
          const offenseCard = this.createOffenseCard(offense, isSelected, count);
          offensesListElement.appendChild(offenseCard);
        });
      }
      
      this.offensesLists.appendChild(offensesListElement);
    });
  }
  
  // Create offense card element
  createOffenseCard(offense, isSelected, count) {
    const card = document.createElement('div');
    card.className = 'offense-card';
    
    const header = document.createElement('div');
    header.className = 'offense-header';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'offense-checkbox';
    checkbox.dataset.id = offense.id;
    checkbox.checked = isSelected;
    
    const nameElement = document.createElement('div');
    nameElement.className = 'offense-name';
    nameElement.textContent = offense.name;
    
    const timeElement = document.createElement('div');
    timeElement.className = 'offense-time';
    timeElement.textContent = `${offense.time} phút`;
    
    header.appendChild(checkbox);
    header.appendChild(nameElement);
    header.appendChild(timeElement);
    
    const countContainer = document.createElement('div');
    countContainer.className = 'offense-count';
    
    const countLabel = document.createElement('label');
    countLabel.textContent = 'Số lần:';
    
    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.min = '1';
    countInput.value = count;
    countInput.dataset.countId = offense.id;
    countInput.disabled = !isSelected;
    
    countContainer.appendChild(countLabel);
    countContainer.appendChild(countInput);
    
    card.appendChild(header);
    card.appendChild(countContainer);
    
    return card;
  }
  
  // Change the current category
  changeCategory(categoryId) {
    // Update active class on tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === categoryId);
    });
    
    // Update active class on offense lists
    document.querySelectorAll('.offenses-list').forEach(list => {
      list.classList.toggle('active', list.dataset.category === categoryId);
    });
    
    this.currentCategory = categoryId;
  }
  
  // Update results section
  updateResults() {
    // Update total time
    const totalTime = this.dataManager.calculateTotalTime();
    this.totalTimeElement.textContent = `${totalTime} phút`;
    
    // Update selected offenses list
    this.renderSelectedOffenses();
    
    // Update copy text
    this.copyTextArea.value = this.dataManager.generateCopyText();
  }
  
  // Render selected offenses list
  renderSelectedOffenses() {
    this.selectedOffensesList.innerHTML = '';
    
    const selectedOffenses = this.dataManager.getSelectedOffensesDetails();
    
    if (selectedOffenses.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'Chưa chọn tội danh nào';
      this.selectedOffensesList.appendChild(emptyMessage);
    } else {
      selectedOffenses.forEach(offense => {
        const listItem = document.createElement('li');
        
        const nameElement = document.createElement('span');
        nameElement.className = 'selected-offense-name';
        nameElement.textContent = offense.count > 1 
          ? `${offense.name} x${offense.count}` 
          : offense.name;
        
        const timeElement = document.createElement('span');
        timeElement.className = 'selected-offense-time';
        timeElement.textContent = `${offense.totalTime} phút`;
        
        listItem.appendChild(nameElement);
        listItem.appendChild(timeElement);
        this.selectedOffensesList.appendChild(listItem);
      });
    }
  }
  
  // Copy text to clipboard
  copyText() {
    this.copyTextArea.select();
    document.execCommand('copy');
    
    // Show copy feedback
    const originalText = this.copyBtn.textContent;
    this.copyBtn.textContent = 'Đã sao chép!';
    this.copyBtn.classList.add('copied');
    
    setTimeout(() => {
      this.copyBtn.textContent = originalText;
      this.copyBtn.classList.remove('copied');
    }, 2000);
  }
  
  // Refresh the UI (call after data changes)
  refreshUI() {
    this.renderCategories();
    this.renderOffenses();
    this.updateResults();
  }
}

// UI will be initialized in app.js