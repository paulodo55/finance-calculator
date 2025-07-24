// FinanceAI - Smart Financial Calculator for Students
// Main JavaScript functionality

class FinanceAI {
    constructor() {
        this.formulas = this.initializeFormulas();
        this.currentCategory = null;
        this.currentFormula = null;
        this.geminiApiKey = 'AIzaSyDopmkTg1mJiZ2dGeooEil61mUh_hFUZhA';
        this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTooltips();
        this.setupImageUpload();
    }

    // Initialize all financial formulas with interactive elements
    initializeFormulas() {
        return {
            'simple-interest': {
                title: 'Simple Interest Formulas',
                formulas: {
                    'future-value': {
                        name: 'Future Value (Simple Interest)',
                        formula: 'FV = <span class="formula-variable" data-var="P">P</span><span class="formula-operator">(1 +</span> <span class="formula-variable" data-var="r">r</span> <span class="formula-variable" data-var="t">t</span><span class="formula-operator">)</span>',
                        variables: {
                            'FV': {
                                name: 'Future Value',
                                description: 'The final amount after interest is applied',
                                howToFind: 'This is usually what we solve for',
                                solveFor: 'FV = P(1 + rt)'
                            },
                            'P': {
                                name: 'Principal',
                                description: 'The initial amount of money invested or borrowed',
                                howToFind: 'Given in the problem or can be solved for if FV, r, and t are known',
                                solveFor: 'P = FV / (1 + rt)'
                            },
                            'r': {
                                name: 'Annual Interest Rate',
                                description: 'The interest rate per year (as a decimal)',
                                howToFind: 'Convert percentage to decimal (e.g., 5% = 0.05)',
                                solveFor: 'r = (FV/P - 1) / t'
                            },
                            't': {
                                name: 'Time',
                                description: 'Time period in years',
                                howToFind: 'Convert months to years by dividing by 12',
                                solveFor: 't = (FV/P - 1) / r'
                            }
                        }
                    },
                    'simple-interest': {
                        name: 'Simple Interest',
                        formula: 'I = <span class="formula-variable" data-var="P">P</span> <span class="formula-variable" data-var="r">r</span> <span class="formula-variable" data-var="t">t</span>',
                        variables: {
                            'P': {
                                name: 'Principal',
                                description: 'The initial amount of money',
                                howToFind: 'Given in the problem',
                                solveFor: 'P = I / (rt)'
                            },
                            'r': {
                                name: 'Annual Interest Rate',
                                description: 'Interest rate per year (as decimal)',
                                howToFind: 'Convert percentage to decimal',
                                solveFor: 'r = I / (Pt)'
                            },
                            't': {
                                name: 'Time',
                                description: 'Time in years',
                                howToFind: 'Convert months/days to years',
                                solveFor: 't = I / (Pr)'
                            }
                        }
                    }
                }
            },
            'compound-interest': {
                title: 'Compound Interest Formulas',
                formulas: {
                    'compound-future-value': {
                        name: 'Compound Interest Future Value',
                        formula: 'FV = <span class="formula-variable" data-var="P">P</span><span class="formula-operator">(1 +</span> <span class="formula-variable" data-var="r">r</span><span class="formula-operator">/</span><span class="formula-variable" data-var="m">m</span><span class="formula-operator">)</span><sup><span class="formula-variable" data-var="m">m</span><span class="formula-variable" data-var="t">t</span></sup>',
                        variables: {
                            'FV': {
                                name: 'Future Value',
                                description: 'The final amount after compound interest',
                                howToFind: 'This is usually what we solve for',
                                solveFor: 'FV = P(1 + r/m)^(mt)'
                            },
                            'P': {
                                name: 'Principal',
                                description: 'Initial investment amount',
                                howToFind: 'Given in problem or solve: P = FV / (1 + r/m)^(mt)',
                                solveFor: 'P = FV(1 + r/m)^(-mt)'
                            },
                            'r': {
                                name: 'Annual Interest Rate',
                                description: 'Annual interest rate as decimal',
                                howToFind: 'Convert percentage to decimal',
                                solveFor: 'Use logarithms to solve for r'
                            },
                            'm': {
                                name: 'Compounding Frequency',
                                description: 'Number of times compounded per year',
                                howToFind: 'Monthly=12, Quarterly=4, Semi-annually=2, Annually=1',
                                solveFor: 'Usually given in the problem'
                            },
                            't': {
                                name: 'Time',
                                description: 'Number of years',
                                howToFind: 'Convert months to years if needed',
                                solveFor: 't = ln(FV/P) / (m × ln(1 + r/m))'
                            }
                        }
                    },
                    'continuous-compound': {
                        name: 'Continuous Compounding',
                        formula: 'A = <span class="formula-variable" data-var="P">P</span><span class="formula-variable" data-var="e">e</span><sup><span class="formula-variable" data-var="r">r</span><span class="formula-variable" data-var="t">t</span></sup>',
                        variables: {
                            'P': {
                                name: 'Principal',
                                description: 'Initial amount',
                                howToFind: 'Given or solve: P = A/e^(rt)',
                                solveFor: 'P = Ae^(-rt)'
                            },
                            'e': {
                                name: 'Euler\'s Number',
                                description: 'Mathematical constant ≈ 2.71828',
                                howToFind: 'Use e button on calculator',
                                solveFor: 'This is a constant'
                            },
                            'r': {
                                name: 'Interest Rate',
                                description: 'Annual rate as decimal',
                                howToFind: 'Convert percentage to decimal',
                                solveFor: 'r = ln(A/P) / t'
                            },
                            't': {
                                name: 'Time',
                                description: 'Time in years',
                                howToFind: 'Convert if needed',
                                solveFor: 't = ln(A/P) / r'
                            }
                        }
                    }
                }
            },
            'annuities': {
                title: 'Annuity Formulas',
                formulas: {
                    'annuity-future-value': {
                        name: 'Future Value of Annuity',
                        formula: 'FV = <span class="formula-variable" data-var="PMT">PMT</span> × <span class="formula-operator">[(1 +</span> <span class="formula-variable" data-var="r">r</span><span class="formula-operator">/</span><span class="formula-variable" data-var="m">m</span><span class="formula-operator">)</span><sup><span class="formula-variable" data-var="m">m</span><span class="formula-variable" data-var="t">t</span></sup> <span class="formula-operator">- 1] / (</span><span class="formula-variable" data-var="r">r</span><span class="formula-operator">/</span><span class="formula-variable" data-var="m">m</span><span class="formula-operator">)</span>',
                        variables: {
                            'PMT': {
                                name: 'Payment Amount',
                                description: 'Regular payment made each period',
                                howToFind: 'Given in problem or solve using the rearranged formula',
                                solveFor: 'PMT = FV × (r/m) / [(1 + r/m)^(mt) - 1]'
                            },
                            'r': {
                                name: 'Annual Interest Rate',
                                description: 'Interest rate per year as decimal',
                                howToFind: 'Convert percentage to decimal',
                                solveFor: 'Use trial and error or financial calculator'
                            },
                            'm': {
                                name: 'Payment Frequency',
                                description: 'Payments per year',
                                howToFind: 'Monthly=12, Quarterly=4, etc.',
                                solveFor: 'Usually given'
                            },
                            't': {
                                name: 'Time',
                                description: 'Number of years',
                                howToFind: 'Given or calculate from total payments',
                                solveFor: 'mt = ln(FV(r/m)/PMT + 1) / ln(1 + r/m)'
                            }
                        }
                    },
                    'annuity-present-value': {
                        name: 'Present Value of Annuity',
                        formula: 'PV = <span class="formula-variable" data-var="PMT">PMT</span> × <span class="formula-operator">[1 - (1 +</span> <span class="formula-variable" data-var="r">r</span><span class="formula-operator">/</span><span class="formula-variable" data-var="m">m</span><span class="formula-operator">)</span><sup><span class="formula-operator">-</span><span class="formula-variable" data-var="m">m</span><span class="formula-variable" data-var="t">t</span></sup><span class="formula-operator">] / (</span><span class="formula-variable" data-var="r">r</span><span class="formula-operator">/</span><span class="formula-variable" data-var="m">m</span><span class="formula-operator">)</span>',
                        variables: {
                            'PMT': {
                                name: 'Payment Amount',
                                description: 'Regular payment each period',
                                howToFind: 'Given or solve using rearranged formula',
                                solveFor: 'PMT = PV × (r/m) / [1 - (1 + r/m)^(-mt)]'
                            },
                            'PV': {
                                name: 'Present Value',
                                description: 'Current value of future payments',
                                howToFind: 'Amount needed now to fund payments',
                                solveFor: 'This is what we\'re usually solving for'
                            },
                            'r': {
                                name: 'Annual Interest Rate',
                                description: 'Interest rate per year as decimal',
                                howToFind: 'Convert percentage to decimal',
                                solveFor: 'Use financial calculator or iteration'
                            },
                            'm': {
                                name: 'Payment Frequency',
                                description: 'Payments per year',
                                howToFind: 'Monthly=12, Quarterly=4, etc.',
                                solveFor: 'Usually given'
                            },
                            't': {
                                name: 'Time',
                                description: 'Number of years',
                                howToFind: 'Given in problem',
                                solveFor: 'mt = -ln(1 - PV(r/m)/PMT) / ln(1 + r/m)'
                            }
                        }
                    }
                }
            },
            'loans': {
                title: 'Loan & Mortgage Formulas',
                formulas: {
                    'loan-payment': {
                        name: 'Loan Payment Formula',
                        formula: 'PMT = <span class="formula-variable" data-var="PV">PV</span> × <span class="formula-operator">(</span><span class="formula-variable" data-var="r">r</span><span class="formula-operator">/</span><span class="formula-variable" data-var="m">m</span><span class="formula-operator">) / [1 - (1 +</span> <span class="formula-variable" data-var="r">r</span><span class="formula-operator">/</span><span class="formula-variable" data-var="m">m</span><span class="formula-operator">)</span><sup><span class="formula-operator">-</span><span class="formula-variable" data-var="m">m</span><span class="formula-variable" data-var="t">t</span></sup><span class="formula-operator">]</span>',
                        variables: {
                            'PV': {
                                name: 'Loan Amount',
                                description: 'Principal amount borrowed',
                                howToFind: 'Given as loan amount',
                                solveFor: 'PV = PMT × [1 - (1 + r/m)^(-mt)] / (r/m)'
                            },
                            'PMT': {
                                name: 'Monthly Payment',
                                description: 'Regular payment amount',
                                howToFind: 'This is usually what we solve for',
                                solveFor: 'Use the main formula above'
                            },
                            'r': {
                                name: 'Annual Interest Rate',
                                description: 'APR as decimal',
                                howToFind: 'Convert APR percentage to decimal',
                                solveFor: 'Requires iterative methods'
                            },
                            'm': {
                                name: 'Payment Frequency',
                                description: 'Payments per year',
                                howToFind: 'Monthly=12, bi-weekly=26',
                                solveFor: 'Usually given'
                            },
                            't': {
                                name: 'Loan Term',
                                description: 'Length of loan in years',
                                howToFind: 'Given in problem (e.g., 30-year mortgage)',
                                solveFor: 'mt = -ln(1 - PV(r/m)/PMT) / ln(1 + r/m)'
                            }
                        }
                    }
                }
            },
            'demand-supply': {
                title: 'Demand & Supply Functions',
                formulas: {
                    'linear-demand': {
                        name: 'Linear Demand Function',
                        formula: 'q = <span class="formula-variable" data-var="m">m</span><span class="formula-variable" data-var="p">p</span> + <span class="formula-variable" data-var="b">b</span>',
                        variables: {
                            'q': {
                                name: 'Quantity Demanded',
                                description: 'Number of units consumers want to buy',
                                howToFind: 'Given in problem as sales data',
                                solveFor: 'Use the demand function with price'
                            },
                            'm': {
                                name: 'Slope',
                                description: 'Rate of change in demand',
                                howToFind: 'Calculate: m = (q₂ - q₁) / (p₂ - p₁)',
                                solveFor: 'Use two price-quantity points'
                            },
                            'p': {
                                name: 'Price',
                                description: 'Price per unit',
                                howToFind: 'Given in problem',
                                solveFor: 'p = (q - b) / m'
                            },
                            'b': {
                                name: 'Y-Intercept',
                                description: 'Quantity when price is zero',
                                howToFind: 'Use point-slope form with known point',
                                solveFor: 'b = q - mp (using any point)'
                            }
                        }
                    },
                    'equilibrium': {
                        name: 'Market Equilibrium',
                        formula: '<span class="formula-variable" data-var="Qd">Q<sub>d</sub></span> = <span class="formula-variable" data-var="Qs">Q<sub>s</sub></span>',
                        variables: {
                            'Qd': {
                                name: 'Quantity Demanded',
                                description: 'Demand function output',
                                howToFind: 'Use demand function: q = m₁p + b₁',
                                solveFor: 'Set equal to quantity supplied'
                            },
                            'Qs': {
                                name: 'Quantity Supplied',
                                description: 'Supply function output',
                                howToFind: 'Use supply function: q = m₂p + b₂',
                                solveFor: 'Set equal to quantity demanded'
                            }
                        }
                    }
                }
            }
        };
    }

    setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                if (category === 'word-problems') {
                    this.showWordProblemSolver();
                } else if (category === 'ai-tutor') {
                    this.showAITutor();
                } else {
                    this.showCategory(category);
                }
            });
        });

        // Back buttons
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showHome();
        });

        document.getElementById('solver-back-btn').addEventListener('click', () => {
            this.showHome();
        });

        document.getElementById('tutor-back-btn').addEventListener('click', () => {
            this.showHome();
        });

        // Formula controls
        document.getElementById('copy-formula').addEventListener('click', () => {
            this.copyFormula();
        });

        document.getElementById('solve-for').addEventListener('click', () => {
            this.showSolveForOptions();
        });

        // Word problem solver
        document.getElementById('analyze-text').addEventListener('click', () => {
            this.analyzeTextProblem();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Upload area click
        document.getElementById('upload-area').addEventListener('click', () => {
            document.getElementById('image-input').click();
        });

        // Interactive Calculator functionality
        document.getElementById('solve-variable').addEventListener('change', () => {
            this.updateInputFields();
        });

        document.getElementById('calculate-btn').addEventListener('click', () => {
            this.performCalculation();
        });

        document.getElementById('clear-inputs').addEventListener('click', () => {
            this.clearAllInputs();
        });

        // AI Tutor functionality
        document.getElementById('ask-tutor').addEventListener('click', () => {
            this.askAITutor();
        });

        document.getElementById('tutor-question').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.askAITutor();
            }
        });

        // Quick question buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                document.getElementById('tutor-question').value = question;
                this.askAITutor();
            });
        });
    }

    setupTooltips() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('formula-variable') || e.target.classList.contains('formula-number')) {
                this.showTooltip(e);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('formula-variable') || e.target.classList.contains('formula-number')) {
                this.hideTooltip();
            }
        });
    }

    setupImageUpload() {
        const imageInput = document.getElementById('image-input');
        const uploadArea = document.getElementById('upload-area');

        imageInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.analyzeImageProblem(e.target.files[0]);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.backgroundColor = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = '';
            const files = e.dataTransfer.files;
            if (files[0]) {
                this.analyzeImageProblem(files[0]);
            }
        });
    }

    showHome() {
        document.querySelector('.formula-categories').style.display = 'block';
        document.getElementById('formula-display').style.display = 'none';
        document.getElementById('word-problem-solver').style.display = 'none';
        document.getElementById('ai-tutor').style.display = 'none';
        this.currentCategory = null;
        this.currentFormula = null;
    }

    showCategory(category) {
        this.currentCategory = category;
        const categoryData = this.formulas[category];
        
        document.querySelector('.formula-categories').style.display = 'none';
        document.getElementById('word-problem-solver').style.display = 'none';
        document.getElementById('ai-tutor').style.display = 'none';
        
        const formulaDisplay = document.getElementById('formula-display');
        formulaDisplay.style.display = 'block';
        formulaDisplay.classList.add('fade-in');
        
        document.getElementById('formula-title').textContent = categoryData.title;
        
        this.renderFormulaList(categoryData.formulas);
    }

    renderFormulaList(formulas) {
        const formulaBox = document.getElementById('formula-box');
        const explanationPanel = document.getElementById('variable-explanations');
        
        let formulaHTML = '<div class="formula-list">';
        Object.keys(formulas).forEach(key => {
            const formula = formulas[key];
            formulaHTML += `
                <div class="formula-item" data-formula="${key}">
                    <h4>${formula.name}</h4>
                    <div class="formula-equation">${formula.formula}</div>
                </div>
            `;
        });
        formulaHTML += '</div>';
        
        formulaBox.innerHTML = formulaHTML;
        
        // Add click handlers for formula selection
        document.querySelectorAll('.formula-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const formulaKey = e.currentTarget.dataset.formula;
                this.showFormula(formulaKey);
            });
        });
        
        explanationPanel.innerHTML = '<p>Click on a formula above to see detailed variable explanations.</p>';
    }

    showFormula(formulaKey) {
        this.currentFormula = formulaKey;
        const formula = this.formulas[this.currentCategory].formulas[formulaKey];
        
        const formulaBox = document.getElementById('formula-box');
        formulaBox.innerHTML = `
            <div class="selected-formula">
                <h4>${formula.name}</h4>
                <div class="formula-equation">${formula.formula}</div>
            </div>
        `;
        
        this.renderVariableExplanations(formula.variables);
        this.setupInteractiveCalculator(formula);
    }

    renderVariableExplanations(variables) {
        const explanationPanel = document.getElementById('variable-explanations');
        
        let explanationsHTML = '';
        Object.keys(variables).forEach(varKey => {
            const variable = variables[varKey];
            explanationsHTML += `
                <div class="variable-explanation">
                    <h5><span class="formula-variable">${varKey}</span> - ${variable.name}</h5>
                    <p><strong>Description:</strong> ${variable.description}</p>
                    <p><strong>How to find:</strong> ${variable.howToFind}</p>
                    <p><strong>Solve for ${varKey}:</strong> ${variable.solveFor}</p>
                </div>
            `;
        });
        
        explanationPanel.innerHTML = explanationsHTML;
    }

    showWordProblemSolver() {
        document.querySelector('.formula-categories').style.display = 'none';
        document.getElementById('formula-display').style.display = 'none';
        document.getElementById('ai-tutor').style.display = 'none';
        
        const solver = document.getElementById('word-problem-solver');
        solver.style.display = 'block';
        solver.classList.add('fade-in');
    }

    showAITutor() {
        document.querySelector('.formula-categories').style.display = 'none';
        document.getElementById('formula-display').style.display = 'none';
        document.getElementById('word-problem-solver').style.display = 'none';
        
        const tutor = document.getElementById('ai-tutor');
        tutor.style.display = 'block';
        tutor.classList.add('fade-in');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');
    }

    showTooltip(e) {
        const tooltip = document.getElementById('tooltip');
        const tooltipContent = document.getElementById('tooltip-content');
        
        let content = '';
        
        if (e.target.classList.contains('formula-variable')) {
            const varName = e.target.dataset.var;
            if (this.currentFormula && this.currentCategory) {
                const variable = this.formulas[this.currentCategory].formulas[this.currentFormula].variables[varName];
                if (variable) {
                    content = `<strong>${variable.name}</strong><br>${variable.description}`;
                }
            }
        }
        
        if (content) {
            tooltipContent.innerHTML = content;
            tooltip.style.display = 'block';
            tooltip.classList.add('show');
            
            // Position tooltip
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.classList.remove('show');
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 150);
    }

    copyFormula() {
        if (!this.currentFormula || !this.currentCategory) return;
        
        const formula = this.formulas[this.currentCategory].formulas[this.currentFormula];
        const formulaText = formula.formula.replace(/<[^>]*>/g, ''); // Strip HTML tags
        
        navigator.clipboard.writeText(formulaText).then(() => {
            // Show success message
            const btn = document.getElementById('copy-formula');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.style.background = 'var(--gradient-secondary)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--gradient-primary)';
            }, 2000);
        });
    }

    showSolveForOptions() {
        if (!this.currentFormula || !this.currentCategory) return;
        
        const formula = this.formulas[this.currentCategory].formulas[this.currentFormula];
        const variables = Object.keys(formula.variables);
        
        let optionsHTML = '<div class="solve-options"><h4>Solve for which variable?</h4>';
        variables.forEach(varKey => {
            const variable = formula.variables[varKey];
            optionsHTML += `
                <button class="solve-option" data-var="${varKey}">
                    <span class="formula-variable">${varKey}</span> - ${variable.name}
                </button>
            `;
        });
        optionsHTML += '</div>';
        
        const explanationPanel = document.getElementById('variable-explanations');
        explanationPanel.innerHTML = optionsHTML;
        
        // Add click handlers
        document.querySelectorAll('.solve-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const varKey = e.currentTarget.dataset.var;
                this.showSolveForVariable(varKey);
            });
        });
    }

    showSolveForVariable(varKey) {
        const formula = this.formulas[this.currentCategory].formulas[this.currentFormula];
        const variable = formula.variables[varKey];
        
        const formulaBox = document.getElementById('formula-box');
        formulaBox.innerHTML = `
            <div class="solve-for-display">
                <h4>Solving for ${variable.name} (${varKey})</h4>
                <div class="rearranged-formula">${variable.solveFor}</div>
                <p class="solve-explanation">
                    <strong>How to find ${varKey}:</strong> ${variable.howToFind}
                </p>
            </div>
        `;
        
        // Show variable explanations again
        this.renderVariableExplanations(formula.variables);
    }

    analyzeTextProblem() {
        const problemText = document.getElementById('problem-text').value.trim();
        if (!problemText) {
            alert('Please enter a word problem to analyze.');
            return;
        }
        
        this.showLoadingSpinner();
        
        // Simulate AI analysis (in real implementation, this would call an AI API)
        setTimeout(() => {
            this.hideLoadingSpinner();
            this.displayProblemAnalysis(this.simulateAIAnalysis(problemText));
        }, 2000);
    }

    analyzeImageProblem(file) {
        this.showLoadingSpinner();
        
        // In a real implementation, this would use OCR and AI analysis
        setTimeout(() => {
            this.hideLoadingSpinner();
            const mockText = "A $5,000 loan at 6% annual simple interest for 3 years.";
            document.getElementById('problem-text').value = mockText;
            this.displayProblemAnalysis(this.simulateAIAnalysis(mockText));
        }, 3000);
    }

    simulateAIAnalysis(text) {
        // This is a simplified simulation - in reality, this would use NLP and AI
        const analysis = {
            identifiedValues: [],
            suggestedFormula: null,
            steps: []
        };
        
        // Simple pattern matching for demo
        if (text.toLowerCase().includes('simple interest')) {
            analysis.suggestedFormula = {
                category: 'simple-interest',
                formula: 'future-value',
                name: 'Simple Interest Future Value'
            };
            
            // Extract numbers and context
            const numbers = text.match(/\$?[\d,]+/g) || [];
            const percentages = text.match(/\d+%/g) || [];
            const timeWords = text.match(/\d+\s*(year|month|day)s?/g) || [];
            
            if (numbers.length > 0) {
                analysis.identifiedValues.push({
                    variable: 'P',
                    value: numbers[0],
                    description: 'Principal amount'
                });
            }
            
            if (percentages.length > 0) {
                analysis.identifiedValues.push({
                    variable: 'r',
                    value: percentages[0],
                    description: 'Interest rate (convert to decimal)'
                });
            }
            
            if (timeWords.length > 0) {
                analysis.identifiedValues.push({
                    variable: 't',
                    value: timeWords[0],
                    description: 'Time period'
                });
            }
            
            analysis.steps = [
                'Identify this as a simple interest problem',
                'Extract the principal, rate, and time',
                'Use the formula: FV = P(1 + rt)',
                'Substitute values and calculate'
            ];
        } else if (text.toLowerCase().includes('compound')) {
            analysis.suggestedFormula = {
                category: 'compound-interest',
                formula: 'compound-future-value',
                name: 'Compound Interest'
            };
        } else if (text.toLowerCase().includes('payment') || text.toLowerCase().includes('loan')) {
            analysis.suggestedFormula = {
                category: 'loans',
                formula: 'loan-payment',
                name: 'Loan Payment'
            };
        }
        
        return analysis;
    }

    displayProblemAnalysis(analysis) {
        const resultDiv = document.getElementById('analysis-result');
        const identifiedValues = document.getElementById('identified-values');
        const suggestedFormula = document.getElementById('suggested-formula');
        const stepByStep = document.getElementById('step-by-step');
        
        // Display identified values
        let valuesHTML = '<h5>Identified Values</h5>';
        if (analysis.identifiedValues.length > 0) {
            analysis.identifiedValues.forEach(value => {
                valuesHTML += `
                    <div class="identified-value">
                        <span class="formula-variable">${value.variable}</span> = ${value.value}
                        <small>${value.description}</small>
                    </div>
                `;
            });
        } else {
            valuesHTML += '<p>No specific values identified. Please check the problem text.</p>';
        }
        identifiedValues.innerHTML = valuesHTML;
        
        // Display suggested formula
        if (analysis.suggestedFormula) {
            const formula = this.formulas[analysis.suggestedFormula.category].formulas[analysis.suggestedFormula.formula];
            suggestedFormula.innerHTML = `
                <h5>Suggested Formula</h5>
                <div class="suggested-formula-display">
                    <h6>${formula.name}</h6>
                    <div class="formula-equation">${formula.formula}</div>
                    <button class="use-formula-btn" onclick="financeAI.useFormula('${analysis.suggestedFormula.category}', '${analysis.suggestedFormula.formula}')">
                        <i class="fas fa-arrow-right"></i> Use This Formula
                    </button>
                </div>
            `;
        } else {
            suggestedFormula.innerHTML = '<h5>Suggested Formula</h5><p>Could not determine the appropriate formula. Try rephrasing the problem.</p>';
        }
        
        // Display steps
        if (analysis.steps.length > 0) {
            let stepsHTML = '<h5>Solution Steps</h5><ol>';
            analysis.steps.forEach(step => {
                stepsHTML += `<li>${step}</li>`;
            });
            stepsHTML += '</ol>';
            stepByStep.innerHTML = stepsHTML;
        } else {
            stepByStep.innerHTML = '<h5>Solution Steps</h5><p>Steps will be provided once formula is determined.</p>';
        }
        
        resultDiv.style.display = 'block';
        resultDiv.classList.add('slide-up');
    }

    useFormula(category, formulaKey) {
        this.showCategory(category);
        setTimeout(() => {
            this.showFormula(formulaKey);
        }, 300);
    }

    showLoadingSpinner() {
        document.getElementById('loading-spinner').style.display = 'flex';
    }

    hideLoadingSpinner() {
        document.getElementById('loading-spinner').style.display = 'none';
    }

    async askAITutor() {
        const questionInput = document.getElementById('tutor-question');
        const question = questionInput.value.trim();
        
        if (!question) {
            alert('Please enter a question.');
            return;
        }

        // Add user message to chat
        this.addMessageToChat('user', question);
        
        // Clear input and disable button
        questionInput.value = '';
        const askBtn = document.getElementById('ask-tutor');
        askBtn.disabled = true;
        askBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Thinking...';
        
        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await this.callGeminiAPI(question);
            this.hideTypingIndicator();
            this.addMessageToChat('tutor', response);
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Error calling Gemini API:', error);
            this.addMessageToChat('tutor', 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. In the meantime, try using the formula categories above for specific calculations.');
        } finally {
            // Re-enable button
            askBtn.disabled = false;
            askBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Ask Tutor';
        }
    }

    async callGeminiAPI(question) {
        const prompt = `You are Professor FinanceAI, a no-nonsense financial tutor for college students. Your personality is professional, direct, and educational. You focus on teaching concepts clearly without being condescending.

Guidelines for your responses:
- Be concise but thorough in explanations
- Use practical examples when helpful
- Focus on educational value, not just answers
- If asked for calculations, explain the process but don't solve homework directly
- Maintain a professional, slightly stern but helpful tone
- Always encourage learning and understanding over memorization

Student question: ${question}

Respond as Professor FinanceAI would - professionally and educationally focused.`;

        const response = await fetch(`${this.geminiApiUrl}?key=${this.geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid API response format');
        }
    }

    addMessageToChat(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'tutor-message';
        
        const avatar = sender === 'user' ? 'fas fa-user' : 'fas fa-user-graduate';
        const senderName = sender === 'user' ? 'You' : 'Professor FinanceAI';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <p><strong>${senderName}:</strong> ${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'tutor-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span>Professor FinanceAI is thinking</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    setupInteractiveCalculator(formula) {
        const calculatorSection = document.getElementById('calculator-section');
        const solveVariableSelect = document.getElementById('solve-variable');
        
        // Show calculator section
        calculatorSection.style.display = 'block';
        
        // Populate solve-for dropdown
        solveVariableSelect.innerHTML = '';
        Object.keys(formula.variables).forEach(varKey => {
            const option = document.createElement('option');
            option.value = varKey;
            option.textContent = `${varKey} - ${formula.variables[varKey].name}`;
            solveVariableSelect.appendChild(option);
        });
        
        // Set up input fields
        this.updateInputFields();
    }

    updateInputFields() {
        if (!this.currentFormula || !this.currentCategory) return;
        
        const formula = this.formulas[this.currentCategory].formulas[this.currentFormula];
        const solveFor = document.getElementById('solve-variable').value;
        const inputGrid = document.getElementById('input-grid');
        
        inputGrid.innerHTML = '';
        
        Object.keys(formula.variables).forEach(varKey => {
            if (varKey === solveFor) return; // Skip the variable we're solving for
            
            const variable = formula.variables[varKey];
            const inputField = document.createElement('div');
            inputField.className = 'input-field';
            
            inputField.innerHTML = `
                <label for="input-${varKey}">
                    <span class="variable-symbol">${varKey}</span>
                    ${variable.name}
                </label>
                <input 
                    type="number" 
                    id="input-${varKey}" 
                    placeholder="Enter ${variable.name.toLowerCase()}"
                    step="any"
                >
            `;
            
            inputGrid.appendChild(inputField);
        });
    }

    performCalculation() {
        if (!this.currentFormula || !this.currentCategory) return;
        
        const formula = this.formulas[this.currentCategory].formulas[this.currentFormula];
        const solveFor = document.getElementById('solve-variable').value;
        
        // Collect input values
        const inputs = {};
        let allInputsValid = true;
        
        Object.keys(formula.variables).forEach(varKey => {
            if (varKey === solveFor) return;
            
            const input = document.getElementById(`input-${varKey}`);
            if (input) {
                const value = parseFloat(input.value);
                if (isNaN(value)) {
                    allInputsValid = false;
                    input.style.borderColor = 'var(--warning-color)';
                } else {
                    inputs[varKey] = value;
                    input.style.borderColor = 'var(--border-color)';
                }
            }
        });
        
        if (!allInputsValid) {
            alert('Please fill in all required fields with valid numbers.');
            return;
        }
        
        // Perform calculation based on formula type
        const result = this.calculateFormula(this.currentCategory, this.currentFormula, solveFor, inputs);
        
        if (result) {
            this.displaySolution(result, solveFor, inputs, formula);
        }
    }

    calculateFormula(category, formulaKey, solveFor, inputs) {
        const calculators = {
            'simple-interest': {
                'future-value': (solveFor, inputs) => {
                    if (solveFor === 'FV') {
                        const result = inputs.P * (1 + inputs.r * inputs.t);
                        return {
                            value: result,
                            steps: [
                                {
                                    description: 'Start with the simple interest future value formula',
                                    calculation: 'FV = P(1 + rt)'
                                },
                                {
                                    description: 'Substitute the given values',
                                    calculation: `FV = ${inputs.P}(1 + ${inputs.r} × ${inputs.t})`
                                },
                                {
                                    description: 'Calculate the interest rate times time',
                                    calculation: `FV = ${inputs.P}(1 + ${inputs.r * inputs.t})`
                                },
                                {
                                    description: 'Add 1 to the interest calculation',
                                    calculation: `FV = ${inputs.P} × ${1 + inputs.r * inputs.t}`
                                },
                                {
                                    description: 'Multiply to get the final result',
                                    calculation: `FV = $${result.toFixed(2)}`
                                }
                            ],
                            unit: 'dollars'
                        };
                    } else if (solveFor === 'P') {
                        const result = inputs.FV / (1 + inputs.r * inputs.t);
                        return {
                            value: result,
                            steps: [
                                {
                                    description: 'Start with the rearranged formula for Principal',
                                    calculation: 'P = FV / (1 + rt)'
                                },
                                {
                                    description: 'Substitute the given values',
                                    calculation: `P = ${inputs.FV} / (1 + ${inputs.r} × ${inputs.t})`
                                },
                                {
                                    description: 'Calculate the denominator',
                                    calculation: `P = ${inputs.FV} / ${1 + inputs.r * inputs.t}`
                                },
                                {
                                    description: 'Divide to get the final result',
                                    calculation: `P = $${result.toFixed(2)}`
                                }
                            ],
                            unit: 'dollars'
                        };
                    } else if (solveFor === 'r') {
                        const result = (inputs.FV / inputs.P - 1) / inputs.t;
                        return {
                            value: result,
                            steps: [
                                {
                                    description: 'Start with the rearranged formula for rate',
                                    calculation: 'r = (FV/P - 1) / t'
                                },
                                {
                                    description: 'Substitute the given values',
                                    calculation: `r = (${inputs.FV}/${inputs.P} - 1) / ${inputs.t}`
                                },
                                {
                                    description: 'Calculate FV/P',
                                    calculation: `r = (${inputs.FV / inputs.P} - 1) / ${inputs.t}`
                                },
                                {
                                    description: 'Subtract 1',
                                    calculation: `r = ${inputs.FV / inputs.P - 1} / ${inputs.t}`
                                },
                                {
                                    description: 'Divide by time to get the rate',
                                    calculation: `r = ${result.toFixed(4)} (${(result * 100).toFixed(2)}%)`
                                }
                            ],
                            unit: 'decimal (percentage)'
                        };
                    } else if (solveFor === 't') {
                        const result = (inputs.FV / inputs.P - 1) / inputs.r;
                        return {
                            value: result,
                            steps: [
                                {
                                    description: 'Start with the rearranged formula for time',
                                    calculation: 't = (FV/P - 1) / r'
                                },
                                {
                                    description: 'Substitute the given values',
                                    calculation: `t = (${inputs.FV}/${inputs.P} - 1) / ${inputs.r}`
                                },
                                {
                                    description: 'Calculate FV/P',
                                    calculation: `t = (${inputs.FV / inputs.P} - 1) / ${inputs.r}`
                                },
                                {
                                    description: 'Subtract 1',
                                    calculation: `t = ${inputs.FV / inputs.P - 1} / ${inputs.r}`
                                },
                                {
                                    description: 'Divide by rate to get the time',
                                    calculation: `t = ${result.toFixed(2)} years`
                                }
                            ],
                            unit: 'years'
                        };
                    }
                },
                'simple-interest': (solveFor, inputs) => {
                    if (solveFor === 'I') {
                        const result = inputs.P * inputs.r * inputs.t;
                        return {
                            value: result,
                            steps: [
                                {
                                    description: 'Start with the simple interest formula',
                                    calculation: 'I = Prt'
                                },
                                {
                                    description: 'Substitute the given values',
                                    calculation: `I = ${inputs.P} × ${inputs.r} × ${inputs.t}`
                                },
                                {
                                    description: 'Multiply all values together',
                                    calculation: `I = $${result.toFixed(2)}`
                                }
                            ],
                            unit: 'dollars'
                        };
                    }
                    // Add other solve-for cases for simple interest
                }
            },
            'compound-interest': {
                'compound-future-value': (solveFor, inputs) => {
                    if (solveFor === 'FV') {
                        const result = inputs.P * Math.pow(1 + inputs.r / inputs.m, inputs.m * inputs.t);
                        return {
                            value: result,
                            steps: [
                                {
                                    description: 'Start with the compound interest formula',
                                    calculation: 'FV = P(1 + r/m)^(mt)'
                                },
                                {
                                    description: 'Substitute the given values',
                                    calculation: `FV = ${inputs.P}(1 + ${inputs.r}/${inputs.m})^(${inputs.m} × ${inputs.t})`
                                },
                                {
                                    description: 'Calculate r/m (rate per period)',
                                    calculation: `FV = ${inputs.P}(1 + ${inputs.r / inputs.m})^${inputs.m * inputs.t}`
                                },
                                {
                                    description: 'Calculate (1 + r/m)',
                                    calculation: `FV = ${inputs.P} × ${1 + inputs.r / inputs.m}^${inputs.m * inputs.t}`
                                },
                                {
                                    description: 'Calculate the exponent',
                                    calculation: `FV = ${inputs.P} × ${Math.pow(1 + inputs.r / inputs.m, inputs.m * inputs.t).toFixed(6)}`
                                },
                                {
                                    description: 'Multiply to get the final result',
                                    calculation: `FV = $${result.toFixed(2)}`
                                }
                            ],
                            unit: 'dollars'
                        };
                    }
                    // Add other solve-for cases
                }
            }
            // Add more formula categories as needed
        };

        const categoryCalculators = calculators[category];
        if (categoryCalculators && categoryCalculators[formulaKey]) {
            return categoryCalculators[formulaKey](solveFor, inputs);
        }

        return null;
    }

    displaySolution(result, solveFor, inputs, formula) {
        const solutionDisplay = document.getElementById('solution-display');
        const solutionSteps = document.getElementById('solution-steps');
        const finalAnswer = document.getElementById('final-answer');
        
        // Clear previous solution
        solutionSteps.innerHTML = '';
        
        // Add solution steps
        result.steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'solution-step';
            stepDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: var(--spacing-3);">
                    <span class="step-number">${index + 1}</span>
                    <div style="flex: 1;">
                        <div class="step-description">${step.description}</div>
                        <div class="step-calculation">${step.calculation}</div>
                    </div>
                </div>
            `;
            solutionSteps.appendChild(stepDiv);
        });
        
        // Display final answer
        const variableName = formula.variables[solveFor].name;
        finalAnswer.innerHTML = `
            <h6>Final Answer</h6>
            <div class="answer-value">
                ${solveFor} = ${result.value.toFixed(2)}
                <span class="answer-unit">${result.unit}</span>
            </div>
            <div style="margin-top: var(--spacing-2); font-size: var(--font-size-sm);">
                ${variableName}: ${result.value.toFixed(2)} ${result.unit}
            </div>
        `;
        
        // Show solution
        solutionDisplay.style.display = 'block';
        solutionDisplay.scrollIntoView({ behavior: 'smooth' });
    }

    clearAllInputs() {
        const inputs = document.querySelectorAll('#input-grid input');
        inputs.forEach(input => {
            input.value = '';
            input.style.borderColor = 'var(--border-color)';
        });
        
        const solutionDisplay = document.getElementById('solution-display');
        solutionDisplay.style.display = 'none';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financeAI = new FinanceAI();
});

// Add some CSS for the new elements
const additionalCSS = `
.formula-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
}

.formula-item {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-4);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.formula-item:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.formula-item h4 {
    margin-bottom: var(--spacing-2);
    color: var(--text-primary);
    font-size: var(--font-size-lg);
}

.formula-equation {
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-base);
    padding: var(--spacing-2);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
}

.selected-formula {
    text-align: center;
}

.selected-formula h4 {
    margin-bottom: var(--spacing-4);
    color: var(--primary-color);
    font-size: var(--font-size-xl);
}

.selected-formula .formula-equation {
    font-size: var(--font-size-lg);
    padding: var(--spacing-4);
}

.variable-explanation {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-4);
    margin-bottom: var(--spacing-4);
    border-left: 4px solid var(--primary-color);
}

.variable-explanation h5 {
    margin-bottom: var(--spacing-2);
    color: var(--text-primary);
}

.variable-explanation p {
    margin-bottom: var(--spacing-2);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
}

.solve-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
}

.solve-option {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-3) var(--spacing-4);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    font-family: var(--font-family);
}

.solve-option:hover {
    border-color: var(--primary-color);
    background: rgba(99, 102, 241, 0.05);
}

.solve-for-display {
    text-align: center;
}

.rearranged-formula {
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-lg);
    background: var(--bg-tertiary);
    padding: var(--spacing-4);
    border-radius: var(--radius-md);
    margin: var(--spacing-4) 0;
    border: 2px solid var(--secondary-color);
}

.solve-explanation {
    background: var(--bg-tertiary);
    padding: var(--spacing-3);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.identified-value {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-2);
}

.identified-value small {
    color: var(--text-muted);
    margin-left: auto;
}

.suggested-formula-display {
    text-align: center;
}

.use-formula-btn {
    background: var(--gradient-primary);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    padding: var(--spacing-2) var(--spacing-4);
    margin-top: var(--spacing-3);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: var(--font-family);
    font-weight: 500;
}

.use-formula-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}
`;

// Add the additional CSS to the document
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style); 