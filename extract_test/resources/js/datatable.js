require('./jquery');

import 'datatables.net';

require('./datatable-tailwind');
require('./datatable-date-sort');

window.actionIcons = function (options = {}) {
    let output = `<div class="flex item-center justify-center">`;
    if (options.show) {
        output += `<div class="w-4 mr-2 transform hover:text-primary-500 hover:scale-110">
            <a href="${options.show}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </a>
        </div>`;
    }
    if (options.check) {
        output += `<div class="w-4 mr-2 transform hover:text-primary-500 hover:scale-110">
            <a href="${options.check}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </a>
        </div>`;
    }
    if (options.edit) {
        output += `<div class="w-4 mr-2 transform hover:text-primary-500 hover:scale-110">
            <a href="${options.edit}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </a>
        </div>`;
    }
    if (options.cancel) {
        output += `<div class="w-4 mr-2 transform hover:text-primary-500 hover:scale-110">
           <a href="${options.cancel}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </a>
        </div>`;
    }
    if (options.portal) {
        output += `<div class="w-4 mr-2 transform hover:text-primary-500 hover:scale-110">
           <a href="${options.portal}" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" class="transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            </a>
        </div>`;
    }
    if (options.delete) {
        let token = document.querySelector('[name="csrf-token"]').content;
        output += `<div class="w-4 mr-2 transform hover:text-primary-500 hover:scale-110">
            <a onclick="confirm('Are you sure about your action?') &&this.nextElementSibling.submit()" class="delete cursor-pointer text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </a>
            <form action="${options.delete}" method="post">
            <input type="hidden" name="_method" value="DELETE"/>
            <input type="hidden" name="_token" value="` + token + `">
            </form>
        </div>`;
    }
    return output + `</div>`;
};
