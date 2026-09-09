/* rsvp.js — sends RSVP form submissions to a Google Sheet via a
   Google Apps Script Web App. Loaded at the end of <body>, after main.js.

   Setup:
   1. Create (or open) the Google Sheet responses should land in.
   2. Extensions → Apps Script, paste a doPost(e) handler that appends
      e.parameter fields as a new row, then Deploy → New deployment →
      Web app (Execute as: Me, Who has access: Anyone).
   3. Paste the deployment's /exec URL below. */

(function () {
  "use strict";

  var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykh-mBZ4nYC5XDd4xJpod1I1fEGfRv4GvpcP8gLb5kEMDbVOORrErkoUwX4zYCNBs8tw/exec";

  var form = document.getElementById("rsvp-form");
  if (!form) return;

  var formFields = form.querySelector(".rsvp-form-fields");
  var submitButton = form.querySelector(".rsvp-submit");
  var status = form.querySelector(".rsvp-status");
  var nameInput = document.getElementById("rsvp-names");

  if (nameInput) {
    nameInput.addEventListener("input", function () {
      nameInput.classList.remove("rsvp-field-invalid");
    });
  }

  // "Accepts" and "declines" are mutually exclusive — checking one
  // clears the other. At least one of the two is required to submit.
  var acceptsBox = document.getElementById("rsvp-accepts");
  var declinesBox = document.getElementById("rsvp-declines");

  function clearChoiceInvalid() {
    if (acceptsBox) acceptsBox.closest(".rsvp-choice").classList.remove("rsvp-choice-invalid");
    if (declinesBox) declinesBox.closest(".rsvp-choice").classList.remove("rsvp-choice-invalid");
  }

  if (acceptsBox && declinesBox) {
    acceptsBox.addEventListener("change", function () {
      if (acceptsBox.checked) declinesBox.checked = false;
      clearChoiceInvalid();
    });
    declinesBox.addEventListener("change", function () {
      if (declinesBox.checked) acceptsBox.checked = false;
      clearChoiceInvalid();
    });
  }

  // Guest count is capped at 10, since the max attribute alone doesn't
  // stop someone from typing a bigger number.
  var guestCount = document.getElementById("rsvp-guest-count");
  if (guestCount) {
    guestCount.addEventListener("input", function () {
      if (guestCount.value.length > 2) {
        guestCount.value = guestCount.value.slice(0, 2);
      }
      if (Number(guestCount.value) > 10) {
        guestCount.value = "10";
      }
      guestCount.classList.remove("rsvp-field-invalid");
    });
  }

  function setStatus(message, state) {
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
    if (state) {
      status.setAttribute("data-state", state);
    } else {
      status.removeAttribute("data-state");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (nameInput && !nameInput.value.trim()) {
      nameInput.classList.add("rsvp-field-invalid");
      nameInput.focus();
      return;
    }

    if (acceptsBox && declinesBox && !acceptsBox.checked && !declinesBox.checked) {
      acceptsBox.closest(".rsvp-choice").classList.add("rsvp-choice-invalid");
      declinesBox.closest(".rsvp-choice").classList.add("rsvp-choice-invalid");
      return;
    }

    if (acceptsBox && acceptsBox.checked && guestCount && !guestCount.value) {
      guestCount.classList.add("rsvp-field-invalid");
      guestCount.focus();
      return;
    }

    if (!SCRIPT_URL || SCRIPT_URL.indexOf("PASTE_YOUR") === 0) {
      setStatus("This form isn't connected yet — add the Apps Script URL in rsvp.js.", "error");
      return;
    }

    if (submitButton) submitButton.disabled = true;
    setStatus("Sending…");

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: new FormData(form)
    })
      .then(function () {
        // "no-cors" means we can't read the response, so a resolved
        // fetch is the best signal we have that the request went out.
        form.reset();
        setStatus("Looking forward to seeing you in Spain, if not, we'll be thinking about you!", "success");
        if (formFields) formFields.hidden = true;
      })
      .catch(function () {
        setStatus("Something went wrong. Please try again in a moment.", "error");
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
      });
  });
})();
