import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Mock navigator.locks to prevent Supabase lock acquisition errors
// This must be done before any Supabase modules are loaded
if (typeof navigator !== 'undefined') {
  if (!navigator.locks) {
    Object.defineProperty(navigator, 'locks', {
      value: {
        request: (name: string, callback: any) => {
          try {
            return Promise.resolve(callback({}));
          } catch (error) {
            return Promise.reject(error);
          }
        },
        query: () => Promise.resolve({ held: [], pending: [] })
      },
      writable: true,
      configurable: true
    });
  }
}

// Suppress console errors from Supabase lock failures during testing
const originalError = console.error;
console.error = function(...args: any[]) {
  const message = args[0]?.toString?.() || '';
  if (!message.includes('Acquiring an exclusive Navigator LockManager lock')) {
    originalError.apply(console, args);
  }
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
