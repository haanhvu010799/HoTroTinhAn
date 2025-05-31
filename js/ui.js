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
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
      location.reload(); // hành vi giống F5
    });
      // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      this.searchOffenses(keyword);
    });
 // code profile
    const copyProfileBtn = document.getElementById('copyProfileBtn');
    copyProfileBtn.addEventListener('click', () => {
      const profileArea = document.getElementById('profileResult');
      profileArea.select();
      document.execCommand('copy');

      copyProfileBtn.textContent = 'Đã sao chép!';
      setTimeout(() => {
        copyProfileBtn.textContent = 'Sao chép hồ sơ';
      }, 2000);
    });

    // Khi người dùng nhập dữ liệu trong các ô input, cập nhật hồ sơ ngay
    ['profileName', 'profileCCCD', 'profileTangVat', 'profileNote'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        this.generateProfile();
      });
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
    
    // Tính tiền bảo lãnh
    const bailAmount = this.dataManager.calculateBailAmount();
    const bailAmountElement = document.getElementById('bailAmount');
    bailAmountElement.textContent = bailAmount > 0 ? `${bailAmount.toLocaleString()}$` : 'Không được bảo lãnh';

    // Update selected offenses list
    this.renderSelectedOffenses();
    
    // Update copy text
    this.copyTextArea.value = this.dataManager.generateCopyText();
    this.generateProfile();

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
// // Tìm kiếm tội danh trong tất cả các categories
//   searchOffenses(keyword) {
//     document.querySelectorAll('.offenses-list').forEach(list => {
//       let hasMatch = false;
      
//       list.querySelectorAll('.offense-card').forEach(card => {
//         const name = card.querySelector('.offense-name').textContent.toLowerCase();
//         if (name.includes(keyword)) {
//           card.style.display = '';
//           hasMatch = true;
//         } else {
//           card.style.display = 'none';
//         }
//       });

//       // Ẩn danh mục nếu không có offense nào phù hợp
//       list.style.display = hasMatch ? '' : 'none';
//     });
//   }
removeVietnameseTones(str) {
  return str
    .normalize('NFD')                      // Chuyển về dạng ký tự chuẩn
    .replace(/[\u0300-\u036f]/g, '')      // Xóa dấu
    .replace(/đ/g, 'd')                   // Chuyển đ → d
    .replace(/Đ/g, 'D')                   // Chuyển Đ → D
    .toLowerCase();
}
searchOffenses(keyword) {
  const keywordNormalized = this.removeVietnameseTones(keyword.toLowerCase());
  const offensesListsContainer = document.getElementById('offensesLists');
  
  // Nếu ô tìm kiếm rỗng, render lại giao diện gốc
  if (!keyword.trim()) {
    this.renderOffenses();
    return;
  }
  
  const matchingOffenses = [];
  for (const categoryId in this.dataManager.offenses) {
    this.dataManager.offenses[categoryId].forEach(offense => {
      const offenseNameNormalized = this.removeVietnameseTones(offense.name.toLowerCase());
      if (offenseNameNormalized.includes(keywordNormalized)) {
        matchingOffenses.push(offense);
      }
    });
  }
  
  // Hiển thị kết quả tìm kiếm (như trước đó)
  offensesListsContainer.innerHTML = '';
  const searchList = document.createElement('div');
  searchList.className = 'offenses-list active';
  
  if (matchingOffenses.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'Không tìm thấy tội danh phù hợp';
    searchList.appendChild(emptyMessage);
  } else {
    matchingOffenses.forEach(offense => {
      const isSelected = this.dataManager.selectedOffenses[offense.id] !== undefined;
      const count = isSelected ? this.dataManager.selectedOffenses[offense.id] : 1;
      const card = this.createOffenseCard(offense, isSelected, count);
      searchList.appendChild(card);
    });
  }
  
  offensesListsContainer.appendChild(searchList);
}
generateProfile() {
  const name = document.getElementById('profileName').value || 'Chưa có';
  const cccd = document.getElementById('profileCCCD').value || 'Chưa có';
  const tangVatRaw = document.getElementById('profileTangVat').value || 'Chưa có';
  const note = document.getElementById('profileNote').value.trim();

  const selectedDetails = this.dataManager.getSelectedOffensesDetails();
const offensesText = selectedDetails.map(o => {
  const categoryId = this.dataManager.findOffenseById(o.id).categoryId;
  if ((categoryId === 'riot' || categoryId === 'hqAttack') && o.count > 1) {
    return `${o.name} (lần ${o.count})`;
  }
  return o.count > 1 ? `${o.name} x${o.count}` : o.name;
}).join(' + ');

  const totalTime = this.dataManager.calculateTotalTime();

  // Tang vật: không thụt lề nữa!
  const tangVatLines = tangVatRaw;

  // Mẫu hồ sơ
  let profile = 
`Tên      : ${name}
CCCD     : ${cccd}
Tội danh : ${offensesText}
Tang vật :
${tangVatLines}
Mức án   : ${totalTime}p`;

  if (note) {
    profile += `\nNote     : ${note}`;
  }

  profile += `\nĐã xử lý`;

  document.getElementById('profileResult').value = profile;
}

  // Refresh the UI (call after data changes)
  refreshUI() {
    this.renderCategories();
    this.renderOffenses();
    this.updateResults();
  }


}



// UI will be initialized in app.js