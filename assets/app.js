// Alpine JS Application
function app() {
    return {
        // DATA
        apiUrl: 'https://script.google.com/macros/s/AKfycbyPnJAO6iRftkg7kknjWfV6jKezCKpqeiIp94eeGg5sGrNh8wCeMFCPXoz39hx-kGMQ/exec', // PASTE URL DARI GOOGLE APPS SCRIPT DI SINI
        activeModal: null,

        projects: [
            {
                id: 1,
                title: 'E-Commerce Platform',
                description: 'Platform e-commerce modern dengan fitur cart, checkout, dan payment gateway integration.',
                image_url: 'https://images.unsplash.com/photo-1661956601031-faf82fcef0f3?w=500&h=300&fit=crop',
                project_url: 'https://github.com/yourusername/ecommerce',
                technologies: ['React', 'Node.js', 'MongoDB'],
                created_at: '2024-01-15',
                updated_at: '2024-06-20'
            },
            {
                id: 2,
                title: 'Task Management App',
                description: 'Aplikasi manajemen tugas dengan fitur drag-drop, deadline tracking, dan team collaboration.',
                image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
                project_url: 'https://github.com/yourusername/taskapp',
                technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
                created_at: '2024-02-10',
                updated_at: '2024-07-05'
            },
            {
                id: 3,
                title: 'Weather Dashboard',
                description: 'Dashboard cuaca real-time dengan visualisasi data, forecast, dan multiple location support.',
                image_url: 'https://images.unsplash.com/photo-1563629232-4ce6b2cdc4e9?w=500&h=300&fit=crop',
                project_url: 'https://github.com/yourusername/weather',
                technologies: ['JavaScript', 'API REST', 'Chart.js'],
                created_at: '2024-03-05',
                updated_at: '2024-08-12'
            },
            {
                id: 4,
                title: 'Blog Platform',
                description: 'Platform blogging dengan markdown support, SEO optimization, dan social media integration.',
                image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&h=300&fit=crop',
                project_url: 'https://github.com/yourusername/blog',
                technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
                created_at: '2024-04-20',
                updated_at: '2024-09-03'
            },
            {
                id: 5,
                title: 'Fitness Tracker',
                description: 'Aplikasi tracking fitness dengan workout logging, progress visualization, dan social features.',
                image_url: 'https://images.unsplash.com/photo-1526506118085-da8216eab187?w=500&h=300&fit=crop',
                project_url: 'https://github.com/yourusername/fitness',
                technologies: ['Flutter', 'Firebase', 'Dart'],
                created_at: '2024-05-12',
                updated_at: '2024-10-08'
            },
            {
                id: 6,
                title: 'Social Media Analytics',
                description: 'Tools analytics untuk social media dengan real-time stats, engagement tracking, dan reporting.',
                image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
                project_url: 'https://github.com/yourusername/analytics',
                technologies: ['Python', 'Django', 'React'],
                created_at: '2024-06-08',
                updated_at: '2024-11-10'
            }
        ],

        stats: [
            { id: 1, value: '5+', label: 'Projects' },
            { id: 2, value: '8+', label: 'Technologies' },
            { id: 3, value: '3+', label: 'Frameworks' }
        ],

        skills: [
            {
                id: 1,
                title: 'Programming Languages',
                items: [
                    'C# & .NET Ecosystem (Enterprise application development)',
                    'Go (Golang) (High-performance systems)',
                    'Python (Data processing & backend)',
                    'PHP (Efficient dynamic web development)',
                    'JavaScript & Node.js (Modern fullstack development)'
                ]
            },
            {
                id: 2,
                title: 'Frontend Frameworks & CSS',
                items: [
                    'Frameworks: Next.js, React, Alpine JS',
                    'CSS Frameworks: Tailwind CSS, Bootstrap',
                    'Responsive Design: Mobile-first approach'
                ]
            },
            {
                id: 3,
                title: 'Backend & Platforms',
                items: [
                    'Backend: Laravel, CodeIgniter, YII, Django, Flask, Go Gin, Express.js',
                    'ERP & CMS: ODOO (ERP), WordPress'
                ]
            }
        ],

        // STATE
        editingId: null,
        isLoading: false,

        // Form Data Objects
        projectForm: {
            title: '',
            description: '',
            image_url: '',
            project_url: '',
            technologiesStr: ''
        },

        statForm: { value: '', label: '' },
        skillForm: { title: '', itemsStr: '' },

        // --- API HELPERS ---
        async fetchData(type) {
            if (this.apiUrl === 'MASUKKAN_URL_WEB_APP_ANDA_DISINI') return;
            try {
                const response = await fetch(`${this.apiUrl}?action=read&type=${type}`);
                const result = await response.json();
                if (result.status === 'success') {
                    if (type === 'projects') {
                        this.projects = result.data.map(p => ({
                            ...p,
                            technologies: typeof p.technologies === 'string' ? p.technologies.split(',').map(t => t.trim()) : p.technologies
                        }));
                    } else if (type === 'stats') {
                        this.stats = result.data;
                    } else if (type === 'skills') {
                        this.skills = result.data.map(s => ({
                            ...s,
                            items: typeof s.items === 'string' ? s.items.split('\n') : s.items
                        }));
                    }
                }
            } catch (error) {
                console.error(`Error fetching ${type}:`, error);
            }
        },

        async saveItem(type, payload, id) {
            this.isLoading = true;
            const action = id ? 'update' : 'create';
            const fullPayload = id ? { id, ...payload } : payload;

            try {
                const response = await fetch(`${this.apiUrl}?action=${action}&type=${type}`, {
                    method: 'POST',
                    body: JSON.stringify(fullPayload)
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.showSuccessMessage('Berhasil disimpan!');
                    this.fetchData(type);
                    this.closeModal();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error(`Error saving ${type}:`, error);
                alert('Gagal menyimpan data.');
            } finally {
                this.isLoading = false;
            }
        },

        async deleteItem(type, id) {
            if (!confirm('Yakin ingin menghapus data ini?')) return;
            this.isLoading = true;
            try {
                const response = await fetch(`${this.apiUrl}?action=delete&type=${type}`, {
                    method: 'POST',
                    body: JSON.stringify({ id: id })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.showSuccessMessage('Data dihapus!');
                    this.fetchData(type);
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error(`Error deleting ${type}:`, error);
            } finally {
                this.isLoading = false;
            }
        },

        // --- PROJECT METHODS ---
        openProjectForm() {
            this.activeModal = 'project';
            this.editingId = null;
            this.resetProjectForm();
        },

        editProject(id) {
            const project = this.projects.find(p => p.id === id);
            if (project) {
                this.activeModal = 'project';
                this.editingId = id;
                this.projectForm = {
                    title: project.title,
                    description: project.description,
                    image_url: project.image_url,
                    project_url: project.project_url,
                    technologiesStr: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies
                };
            }
        },

        saveProject() {
            if (!this.projectForm.title.trim()) { alert('Judul kosong!'); return; }

            const payload = {
                ...this.projectForm,
                technologies: this.projectForm.technologiesStr
            };
            this.saveItem('projects', payload, this.editingId);
        },

        deleteProject(id) {
            this.deleteItem('projects', id);
        },

        resetProjectForm() {
            this.projectForm = { title: '', description: '', image_url: '', project_url: '', technologiesStr: '' };
        },

        // --- STAT METHODS (Local Only for now unless requested) ---
        openStatForm() {
            this.activeModal = 'stat';
            this.editingId = null;
            this.resetStatForm();
        },

        editStat(id) {
            const stat = this.stats.find(s => s.id === id);
            if (stat) {
                this.activeModal = 'stat';
                this.editingId = id;
                this.statForm = { value: stat.value, label: stat.label };
            }
        },

        saveStat() {
            if (!this.statForm.value.trim()) return;
            this.saveItem('stats', this.statForm, this.editingId);
        },

        deleteStat(id) {
            this.deleteItem('stats', id);
        },

        resetStatForm() { this.statForm = { value: '', label: '' }; },

        // --- SKILL METHODS (Local Only) ---
        openSkillForm() {
            this.activeModal = 'skill';
            this.editingId = null;
            this.resetSkillForm();
        },

        editSkill(id) {
            const skill = this.skills.find(s => s.id === id);
            if (skill) {
                this.activeModal = 'skill';
                this.editingId = id;
                this.skillForm = { title: skill.title, itemsStr: skill.items.join('\n') };
            }
        },

        saveSkill() {
            if (!this.skillForm.title.trim()) return;
            const payload = {
                title: this.skillForm.title,
                items: this.skillForm.itemsStr // Send as string to api
            };
            this.saveItem('skills', payload, this.editingId);
        },

        deleteSkill(id) {
            this.deleteItem('skills', id);
        },

        resetSkillForm() { this.skillForm = { title: '', itemsStr: '' }; },

        // --- COMMON ---
        closeModal() {
            this.activeModal = null;
            this.editingId = null;
            this.resetProjectForm();
            this.resetStatForm();
            this.resetSkillForm();
        },

        showSuccessMessage(message = 'Berhasil!') {
            alert(message);
        },

        init() {
            console.log('App Initialized. Waiting for API URL.');
            this.fetchData('projects');
            this.fetchData('stats');
            this.fetchData('skills');
        }
    };
}

// Initialize when Alpine is ready
document.addEventListener('alpine:init', () => {
    console.log('Alpine.js initialized');
});

// Call init on document ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready - App is loaded');
});
