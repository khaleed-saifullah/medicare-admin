"use strict";

const dropdown = (e) => {
  console.log(e);
};

const dropdownBtns = document.querySelectorAll("#dropdownBtn");
dropdownBtns.forEach((db) => {
  db.addEventListener("click", (e) => {
    e.target.parentElement.children[1].classList.toggle("hide");
    e.target.parentElement.children[1].classList.toggle("show");
  });
});

const hospitals = document.querySelectorAll(".hospital-input");

hospitals.forEach((hp) => {
  hp.addEventListener("click", (e) => {
    let nextSibling = hp.nextElementSibling;
    if (hp.checked) {
      while (nextSibling) {
        nextSibling.disabled = false;
        nextSibling = nextSibling.nextElementSibling;
      }
    } else {
      while (nextSibling) {
        nextSibling.disabled = true;
        nextSibling = nextSibling.nextElementSibling;
      }
    }
  });
});

const sidebar = document.querySelector("#sidebar");

const sidebarToggle = () => {
  sidebar.classList.toggle("sidebar-show");
};

$("#division").change(function () {
  $("#district").empty();

  let division_id = $("#division").val();

  $.post(
    "http://localhost:3000/admin/get-district",
    {
      division_id: division_id,
    },
    function (data, status) {
      $("#district").append(
        ' <option disabled selected value="">' + "By District" + "</option> "
      );
      for (let i = 0; i < data.length; i++) {
        $("#district").append(
          ' <option value="' +
            data[i].id +
            '">' +
            data[i].district_name +
            "</option> "
        );
      }
    }
  );
});

$("#district").change(function () {
  $("#thana").empty();

  let district_id = $("#district").val();

  $.post(
    "http://localhost:3000/admin/get-thana",
    {
      district_id: district_id,
    },
    function (data, status) {
      $("#thana").append(
        ' <option disabled selected value="">' + "By Thana" + "</option> "
      );
      for (let i = 0; i < data.length; i++) {
        $("#thana").append(
          ' <option value="' +
            data[i].id +
            '">' +
            data[i].thana_name +
            "</option> "
        );
      }
    }
  );
});

$("#divisionOne").change(function () {
  $("#districtOne").empty();

  let division_id = $("#divisionOne").val();

  $.post(
    "http://localhost:3000/admin/get-district",
    {
      division_id: division_id,
    },
    function (data, status) {
      $("#districtOne").append(
        ' <option disabled selected value="">' + "By District" + "</option> "
      );
      for (let i = 0; i < data.length; i++) {
        $("#districtOne").append(
          ' <option value="' +
            data[i].id +
            '">' +
            data[i].district_name +
            "</option> "
        );
      }
    }
  );
});

$("#districtOne").change(function () {
  $("#thanaOne").empty();

  let district_id = $("#districtOne").val();

  $.post(
    "http://localhost:3000/admin/get-thana",
    {
      district_id: district_id,
    },
    function (data, status) {
      $("#thanaOne").append(
        ' <option disabled selected value="">' + "By Thana" + "</option> "
      );
      for (let i = 0; i < data.length; i++) {
        $("#thanaOne").append(
          ' <option value="' +
            data[i].id +
            '">' +
            data[i].thana_name +
            "</option> "
        );
      }
    }
  );
});

function changeDistrict(division_id) {
  let division = $("#" + division_id);
  let district = division.siblings("select[name='district_id']").attr("id");
  let district_id = $("#" + district);
  district_id.empty();

  let division_value = division.val();

  $.post(
    "http://localhost:3000/admin/get-district",
    {
      division_id: division_value,
    },
    function (data, status) {
      district_id.append(
        ' <option disabled selected value="">' + "By District" + "</option> "
      );
      for (let i = 0; i < data.length; i++) {
        district_id.append(
          ' <option value="' +
            data[i].id +
            '">' +
            data[i].district_name +
            "</option> "
        );
      }
    }
  );
}

function changeThana(district_id) {
  let district = $("#" + district_id);
  console.log(district_id);
  let thana = district.siblings("select[name='thana_id']").attr("id");
  let thana_id = $("#" + thana);
  thana_id.empty();

  let district_value = district.val();
  console.log(district_value);

  $.post(
    "http://localhost:3000/admin/get-thana",
    {
      district_id: district_value,
    },
    function (data, status) {
      thana_id.append(
        ' <option disabled selected value="">' + "By Thana" + "</option> "
      );
      for (let i = 0; i < data.length; i++) {
        thana_id.append(
          ' <option value="' +
            data[i].id +
            '">' +
            data[i].thana_name +
            "</option> "
        );
      }
    }
  );
}

function previewFile(input) {
  let inputFlied = $("#" + input);
  let image = inputFlied.siblings("img").attr("id");
  var file = inputFlied.get(0).files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function () {
      $("#" + image).attr("src", reader.result);
    };

    reader.readAsDataURL(file);
  }
}

function previewFileEdit(input) {
  let inputFlied = $("#" + input);
  let image = inputFlied.siblings("img").attr("id");

  var file = inputFlied.get(0).files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function () {
      $("#" + image).attr("src", reader.result);
    };

    reader.readAsDataURL(file);
  }
}

let notClicked = false;

function getDoctor(hospital_id) {
  if (!notClicked) {
    let doctor = $("#" + hospital_id);
    doctor.empty();
    $.post(
      "http://localhost:3000/admin/get-doctor-by-hospital",
      {
        hospital_id: hospital_id,
      },
      function (data, status) {
        doctor.append(
          ' <option disabled selected value="">' +
            "Select Doctor" +
            "</option> "
        );
        for (let i = 0; i < data.length; i++) {
          doctor.append(
            ' <option value="' +
              data[i].doctor_id +
              '">' +
              data[i].doctor_name +
              "</option> "
          );
        }
      }
    );
  }
  notClicked = true;
}
