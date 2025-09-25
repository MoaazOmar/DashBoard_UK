import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef ,Renderer2, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements AfterViewInit , OnInit {
  isOpen: boolean = false;
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('mainContent') mainContent!: ElementRef;
  currentRoute: string = '';
  constructor(private _router : Router) { }
  ngOnInit(): void {
    this._router.events.subscribe(() => {
      this.currentRoute = this._router.url;
    });
  }
  ngAfterViewInit(): void {
    // إعداد الحالة الابتدائية بالـ GSAP
    // اجعل السايدبار مخفي (متحول لليسار بالكامل) وعناصره مخفية
    if (this.sidebar && this.sidebar.nativeElement) {
      gsap.set(this.sidebar.nativeElement, { x: '-100%' }); // مخفي يسار
      const children = this.sidebar.nativeElement.querySelectorAll(':scope > *');
      gsap.set(children, { opacity: 0, y: 20 });
    }
    
    // ضبط الوضع الليلي (optional)
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }


  toggleSidebar(): void {
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menuBtn');

    if (!this.sidebar || !this.mainContent || !overlay || !menuBtn) return;

    const sidebarEl = this.sidebar.nativeElement;
    const mainEl = this.mainContent.nativeElement;
    const children = sidebarEl.querySelectorAll(':scope > *');

    if (!this.isOpen) {
      // فتح السايدبار
      const tl = gsap.timeline();
      // أظهر السايدبار (من -100% إلى 0%)
      tl.to(sidebarEl, {
        x: '0%',
        duration: 0.45,
        ease: 'power3.out'
      });
      // حرك المحتوى الرئيسي لليمين بنسبة 40% (بيدّي مساحة للسايدبار)
      tl.to(mainEl, {
        marginLeft: '25%',
        duration: 0.45,
        ease: 'power3.out'
      }, '-=0.45');
      // أظهر الـ overlay
      tl.to(overlay, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.25,
        ease: 'power2.out'
      }, '-=0.25');
      // أظهر العناصر داخل السايدبار (استعمل to وليس from)
      tl.to(children, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.32,
        ease: 'power2.out'
      }, '-=0.25');

      menuBtn.textContent = '✕ Close';
      this.isOpen = true;
    } else {
      // قفل السايدبار
      const tl = gsap.timeline({
        onComplete: () => {
          this.isOpen = false;
        }
      });
      // أولًا أخفي عناصر السايدبار
      tl.to(children, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.22,
        ease: 'power2.in'
      });
      // بعدين حرك السايدبار لليسار (مخفي)
      tl.to(sidebarEl, {
        x: '-100%',
        duration: 0.4,
        ease: 'power3.in'
      }, '-=0.08');
      // رجّع المحتوى الرئيسي مكانه
      tl.to(mainEl, {
        marginLeft: '0%',
        duration: 0.45,
        ease: 'power3.out'
      }, '-=0.35');
      // أخفي الـ overlay
      tl.to(overlay, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.25,
        ease: 'power2.out'
      }, '-=0.35');

      menuBtn.textContent = '☰ Menu';
    }
  }
  // addRainBackground() {
  //   this.renderer.addClass(this.sidebar.nativeElement, 'rain-background');
  // }

  // removeRainBackground() {
  //   this.renderer.removeClass(this.sidebar.nativeElement, 'rain-background');
  // }

}
