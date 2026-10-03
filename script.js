/* ===================================================
   TÍNH TOÁN BMR & TDEE (Công thức Mifflin-St Jeor)
   =================================================== */
const tdeeForm = document.getElementById("tdeeForm");
const genderBtns = document.querySelectorAll(".gender-btn");
const ageInput = document.getElementById("age");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const activitySelect = document.getElementById("activity");

const bmrValue = document.getElementById("bmrValue");
const tdeeValue = document.getElementById("tdeeValue");
const cutCalo = document.getElementById("cutCalo");
const maintainCalo = document.getElementById("maintainCalo");
const bulkCalo = document.getElementById("bulkCalo");

// Đổi giới tính Nam/Nữ
genderBtns.forEach((label) => {
  label.addEventListener("click", () => {
    genderBtns.forEach((l) => l.classList.remove("active"));
    label.classList.add("active");
  });
});

function calculateTDEE() {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const age = parseFloat(ageInput.value);
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const activity = parseFloat(activitySelect.value);

  if (!age || !weight || !height) return;

  // Mifflin-St Jeor Equation:
  // Nam: 10*W + 6.25*H - 5*A + 5
  // Nữ:  10*W + 6.25*H - 5*A - 161
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === "male" ? 5 : -161;

  const tdee = bmr * activity;

  // Cập nhật giao diện
  bmrValue.textContent = Math.round(bmr).toLocaleString("vi-VN");
  tdeeValue.textContent = Math.round(tdee).toLocaleString("vi-VN");
  maintainCalo.textContent = Math.round(tdee).toLocaleString("vi-VN");
  cutCalo.textContent = Math.round(Math.max(1200, tdee - 500)).toLocaleString("vi-VN");
  bulkCalo.textContent = Math.round(tdee + 500).toLocaleString("vi-VN");

  // Đề xuất tự động lượng nước tương ứng theo cân nặng (Khoảng 35ml/kg)
  const suggestedWater = Math.round((weight * 35) / 100) * 100;
  if (!localStorage.getItem("health_user_custom_target")) {
    customWaterTarget.value = Math.max(1500, suggestedWater);
    waterTarget = Math.max(1500, suggestedWater);
    updateWaterUI();
  }
}

tdeeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  calculateTDEE();
});

/* ===================================================
   THEO DÕI NƯỚC UỐNG & LOCALSTORAGE
   =================================================== */
let waterTarget = parseInt(localStorage.getItem("health_water_target")) || 2000;
let waterConsumed = parseInt(localStorage.getItem("health_water_consumed")) || 0;

const waterLevel = document.getElementById("waterLevel");
const waterPercent = document.getElementById("waterPercent");
const waterRatioText = document.getElementById("waterRatioText");
const waterMotivation = document.getElementById("waterMotivation");
const customWaterTarget = document.getElementById("customWaterTarget");
const addWaterBtns = document.querySelectorAll(".add-water-btn");
const customWaterForm = document.getElementById("customWaterForm");
const customAmount = document.getElementById("customAmount");
const resetWaterBtn = document.getElementById("resetWaterBtn");

customWaterTarget.value = waterTarget;

function updateWaterUI() {
  const percent = Math.min(100, Math.round((waterConsumed / waterTarget) * 100));
  waterLevel.style.height = `${percent}%`;
  waterPercent.textContent = `${percent}%`;
  waterRatioText.textContent = `${waterConsumed.toLocaleString("vi-VN")} / ${waterTarget.toLocaleString("vi-VN")} ml`;

  // Cập nhật câu động viên
  if (percent === 0) {
    waterMotivation.textContent = "Hãy bắt đầu ngày mới với một ly nước lọc!";
  } else if (percent < 50) {
    waterMotivation.textContent = "Khởi đầu tốt! Hãy tiếp tục duy trì uống nước đều đặn nhé.";
  } else if (percent < 100) {
    waterMotivation.textContent = "Sắp hoàn thành mục tiêu rồi, chỉ còn một chút nữa thôi!";
  } else {
    waterMotivation.textContent = "🎉 Tuyệt vời! Bạn đã hoàn thành 100% mục tiêu nước hôm nay!";
  }

  // Lưu vào localStorage
  localStorage.setItem("health_water_consumed", waterConsumed);
  localStorage.setItem("health_water_target", waterTarget);
}

// Bấm nút thêm nhanh (+150, +250, +500ml)
addWaterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const amount = parseInt(btn.dataset.amount);
    waterConsumed += amount;
    updateWaterUI();
  });
});

// Thêm số lượng tùy chọn
customWaterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = parseInt(customAmount.value);
  if (val && val > 0) {
    waterConsumed += val;
    customAmount.value = "";
    updateWaterUI();
  }
});

// Thay đổi mục tiêu nước hằng ngày
customWaterTarget.addEventListener("change", (e) => {
  const newTarget = parseInt(e.target.value);
  if (newTarget && newTarget >= 500) {
    waterTarget = newTarget;
    localStorage.setItem("health_user_custom_target", "true");
    updateWaterUI();
  }
});

// Đặt lại lượng nước về 0
resetWaterBtn.addEventListener("click", () => {
  if (confirm("Bạn có muốn đặt lại lượng nước đã uống hôm nay về 0 ml?")) {
    waterConsumed = 0;
    updateWaterUI();
  }
});

// Khởi chạy khi load trang
calculateTDEE();
updateWaterUI();