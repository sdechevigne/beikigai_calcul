window.function = function (prenoms, nom, jour, mois, annee) {
	// Récupération et validation des valeurs depuis Glide
	prenoms = prenoms?.value ?? "";
	nom = nom?.value ?? "";
	jour = parseInt(jour?.value) || 1;
	mois = parseInt(mois?.value) || 1;
	annee = parseInt(annee?.value) || 1900;

	// Configuration des constantes
	const LETTRE_VALEUR = Object.freeze({
		'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
		'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
		'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
	});

	const VOYELLES = Object.freeze(new Set(['A', 'E', 'I', 'O', 'U', 'Y']));
	const MAITRES_NOMBRES = Object.freeze(new Set([11, 22, 33]));
	const MEMOIRES_FAMILIALES = Object.freeze(new Set([13, 14, 16, 19]));

	// Fonctions utilitaires
	const normaliserTexte = (texte) => {
		const substitutions = [
			[/[ÉÈÊË]/g, 'E'], [/[ÀÂÄÃ]/g, 'A'], [/[ÎÏÌ]/g, 'I'],
			[/[ÔÖÒÕ]/g, 'O'], [/[ÛÜÙŨ]/g, 'U'], [/Ç/g, 'C'], [/Ñ/g, 'N']
		];
		
		let resultat = texte.toUpperCase();
		substitutions.forEach(([pattern, replacement]) => {
			resultat = resultat.replace(pattern, replacement);
		});
		return resultat;
	};

	const reduireNombre = (nombre) => {
		while (nombre > 9 && !MAITRES_NOMBRES.has(nombre)) {
			nombre = nombre.toString()
				.split('')
				.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
		}
		return nombre;
	};

	const calculerValeurNom = (nom) => {
		return normaliserTexte(nom.replace(/-/g, ''))
			.split('')
			.reduce((total, lettre) => total + (LETTRE_VALEUR[lettre] || 0), 0);
	};

	const estNombreSpecial = (nombre) => 
		MAITRES_NOMBRES.has(nombre) || MEMOIRES_FAMILIALES.has(nombre);

	// Classe pour encapsuler calcul + total
	class CalculNumerologique {
		constructor(calculs, totalPrincipal = null) {
			this.calculs = Array.isArray(calculs) ? calculs : [calculs];
			this.totalPrincipal = totalPrincipal;
		}
		
		get valeurReduite() {
			// Trouve le bon total selon la logique de priorité
			const totalChoisi = this.calculs.find(calc => estNombreSpecial(calc.total)) || this.calculs[0];
			return reduireNombre(totalChoisi.total).toString();
		}
		
		get totalPourMemoires() {
			// Même logique de priorité pour les mémoires
			const totalChoisi = this.calculs.find(calc => estNombreSpecial(calc.total)) || this.calculs[0];
			return totalChoisi.total;
		}
	}

	// Calculs principaux retournant des objets CalculNumerologique
	const calculerRacine1 = (jour, mois, annee) => {
		const calculs = [
			{ total: jour + mois + annee, methode: 'somme_directe' },
			{ 
				total: `${jour.toString().padStart(2, '0')}${mois.toString().padStart(2, '0')}${annee}`
					.split('')
					.reduce((sum, digit) => sum + parseInt(digit, 10), 0),
				methode: 'somme_chiffres_date'
			},
			{ 
				total: reduireNombre(jour) + reduireNombre(mois) + reduireNombre(annee),
				methode: 'somme_reduite'
			}
		];
		return new CalculNumerologique(calculs);
	};

	const calculerRacine2 = (prenoms, nom) => {
		const total = calculerValeurNom(`${prenoms} ${nom}`);
		return new CalculNumerologique([{ total, methode: 'valeur_nom' }]);
	};

	const calculerTronc = (jour, mois) => {
		const calculs = [
			{ total: jour + mois, methode: 'somme_directe' },
			{ total: reduireNombre(jour) + reduireNombre(mois), methode: 'somme_reduite' }
		];
		return new CalculNumerologique(calculs);
	};

	const calculerValeursTexte = (prenoms, nom, filtreFonction) => {
		const texteComplet = normaliserTexte(`${prenoms} ${nom}`);
		const total = texteComplet
			.split('')
			.filter(filtreFonction)
			.reduce((sum, lettre) => sum + (LETTRE_VALEUR[lettre] || 0), 0);
		return new CalculNumerologique([{ total, methode: 'valeur_lettres' }]);
	};

	const calculerFeuilles = (prenoms, nom) => 
		calculerValeursTexte(prenoms, nom, lettre => VOYELLES.has(lettre));

	const calculerFruits = (prenoms, nom) => 
		calculerValeursTexte(prenoms, nom, lettre => !VOYELLES.has(lettre));

	const calculerDynamique = (racine1Calc, racine2Calc, troncCalc) => {
		const total = parseInt(racine1Calc.valeurReduite) + 
					 parseInt(racine2Calc.valeurReduite) + 
					 parseInt(troncCalc.valeurReduite);
		const reduit = reduireNombre(total);
		return MAITRES_NOMBRES.has(total) ? reduit.toString() : reduit.toString();
	};

	const calculerEcorce = (jour) => reduireNombre(jour).toString();

	const calculerBranches = (prenoms, nom) => {
		return normaliserTexte(`${prenoms} ${nom}`)
			.split('')
			.filter(lettre => ['A', 'J', 'S'].includes(lettre))
			.length
			.toString();
	};

	const calculerQualites = (prenoms, nom) => {
		const texteComplet = normaliserTexte(`${prenoms} ${nom}`);
		const qualites = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
		
		texteComplet.split('').forEach(lettre => {
			const valeur = LETTRE_VALEUR[lettre];
			if (valeur) qualites[valeur]++;
		});
		
		// Réduction des nombres > 9
		Object.keys(qualites).forEach(key => {
			if (qualites[key] > 9) {
				qualites[key] = reduireNombre(qualites[key]);
			}
		});
		
		return qualites;
	};

	const calculerDefis = (jour, mois, annee) => {
		const [jourR, moisR, anneeR] = [jour, mois, annee].map(reduireNombre);
		
		const calculerDefi = (a, b) => {
			const diff = Math.abs(a - b);
			return diff === 0 ? 9 : diff;
		};
		
		return {
			defi1: calculerDefi(jourR, moisR),
			defi2: calculerDefi(jourR, anneeR),
			defi3: calculerDefi(calculerDefi(jourR, moisR), calculerDefi(jourR, anneeR)),
			defi4: calculerDefi(moisR, anneeR)
		};
	};

	const calculerAnneePersonnelle = (jour, mois, anneeActuelle = new Date().getFullYear()) => 
		reduireNombre(jour + mois + anneeActuelle);

	// Exécution des calculs principaux
	const racine1Calc = calculerRacine1(jour, mois, annee);
	const racine2Calc = calculerRacine2(prenoms, nom);
	const troncCalc = calculerTronc(jour, mois);
	const feuillesCalc = calculerFeuilles(prenoms, nom);
	const fruitsCalc = calculerFruits(prenoms, nom);

	// Fonction de recherche des mémoires optimisée
	const chercherMemoires = () => {
		const memoires = [];
		
		// Vérifications directes
		if (MEMOIRES_FAMILIALES.has(jour)) {
			memoires.push({ nombre: jour, lieu: 'Jour de naissance', importance: 'Très forte' });
		}
		
		const totalAnnee = annee.toString()
			.split('')
			.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
		
		if (MEMOIRES_FAMILIALES.has(totalAnnee)) {
			memoires.push({ nombre: totalAnnee, lieu: 'Année de naissance', importance: 'Très forte' });
		}
		
		// Vérifications dans les calculs principaux
		const verificationsMemoires = [
			{ calc: racine1Calc, lieu: 'Première racine (Chemin de vie)', importance: 'Très forte' },
			{ calc: racine2Calc, lieu: 'Seconde racine (Expression)', importance: 'Très forte' },
			{ calc: troncCalc, lieu: 'Tronc (Clé de l\'âme)', importance: 'Très forte' },
			{ calc: feuillesCalc, lieu: 'Feuilles (Besoins affectifs)', importance: 'Forte' },
			{ calc: fruitsCalc, lieu: 'Fruits (Besoins de réalisation)', importance: 'Forte' }
		];
		
		verificationsMemoires.forEach(({ calc, lieu, importance }) => {
			const total = calc.totalPourMemoires;
			if (MEMOIRES_FAMILIALES.has(total)) {
				memoires.push({ nombre: total, lieu, importance });
			}
		});
		
		return memoires;
	};

	// Construction du résultat final
	const resultat = {
		racine1: racine1Calc.valeurReduite,
		racine2: racine2Calc.valeurReduite,
		tronc: troncCalc.valeurReduite,
		dynamique: calculerDynamique(racine1Calc, racine2Calc, troncCalc),
		ecorce: calculerEcorce(jour),
		branches: calculerBranches(prenoms, nom),
		feuilles: feuillesCalc.valeurReduite,
		fruits: fruitsCalc.valeurReduite,
		qualites: calculerQualites(prenoms, nom),
		memoires: chercherMemoires(),
		defis: calculerDefis(jour, mois, annee),
		anneePersonnelle: calculerAnneePersonnelle(jour, mois)
	};

	return JSON.stringify(resultat);
};