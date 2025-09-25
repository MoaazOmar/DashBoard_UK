import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-dl',
  templateUrl: './toggle-dl.component.html',
  styleUrls: ['./toggle-dl.component.css']
})
export class ToggleDlComponent implements OnInit {
  isDarkMode: boolean = false;

  ngOnInit() {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    } else {
      // Fallback to system preference
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = event.matches;
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
      }
    });
  }

toggleTheme() {
  document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
}
}