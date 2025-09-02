window.function = function (prenoms, nom, jour, mois, annee) {
	// Récupération et validation des valeurs depuis Glide
	prenoms = prenoms?.value ?? "";
	nom = nom?.value ?? "";
	jour = parseInt(jour?.value) || 1;
	mois = parseInt(mois?.value) || 1;
	annee = parseInt(annee?.value) || 1900;

	// Configuration des constantes (optimisées avec Object.freeze pour l'immutabilité)
	const LETTRE_VALEUR = Object.freeze({
		'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
		'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
		'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
	});

	const VOYELLES = Object.freeze(new Set(['A', 'E', 'I', 'O', 'U', 'Y']));
	const MAITRES_NOMBRES = Object.freeze(new Set([11, 22, 33]));
	const MEMOIRES_FAMILIALES = Object.freeze(new Set([13, 14, 16, 19]));

	// Fonctions utilitaires optimisées
	const normaliserTexte = (texte) => {
		const substitutions = {
			'[ÉÈÊË]': 'E', '[ÀÂÄÃ]': 'A', '[ÎÏÌ]': 'I',
			'[ÔÖÒÕ]': 'O', '[ÛÜÙŨ]': 'U', 'Ç': 'C', 'Ñ': 'N'
		};
		
		let resultat = texte.toUpperCase();
		for (const [pattern, replacement] of Object.entries(substitutions)) {
			resultat = resultat.replace(new RegExp(pattern, 'g'), replacement);
		}
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
		const nomNormalise = normaliserTexte(nom.replace(/-/g, ''));
		return nomNormalise
			.split('')
			.reduce((total, lettre) => total + (LETTRE_VALEUR[lettre] || 0), 0);
	};

	const estNombreSpecial = (nombre) => 
		MAITRES_NOMBRES.has(nombre) || MEMOIRES_FAMILIALES.has(nombre);

	// Calculs principaux optimisés
	const calculerRacine1 = (jour, mois, annee) => {
		const total1 = jour + mois + annee;
		const reduit1 = reduireNombre(total1);
		
		const dateStr = `${jour.toString().padStart(2, '0')}${mois.toString().padStart(2, '0')}${annee}`;
		const total2 = dateStr
			.split('')
			.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
		const reduit2 = reduireNombre(total2);
		
		const total3 = reduireNombre(jour) + reduireNombre(mois) + reduireNombre(annee);
		const reduit3 = reduireNombre(total3);
		
		// Priorisation des nombres spéciaux
		if (estNombreSpecial(total2)) return reduit2.toString();
		if (estNombreSpecial(total3)) return reduit3.toString();
		if (estNombreSpecial(total1)) return reduit1.toString();
		
		return reduit1.toString();
	};

	const calculerRacine2 = (prenoms, nom) => {
		const total = calculerValeurNom(`${prenoms} ${nom}`);
		const reduit = reduireNombre(total);
		return estNombreSpecial(total) ? reduit.toString() : reduit.toString();
	};

	const calculerTronc = (jour, mois) => {
		const total1 = jour + mois;
		const reduit1 = reduireNombre(total1);
		
		const total2 = reduireNombre(jour) + reduireNombre(mois);
		const reduit2 = reduireNombre(total2);
		
		if (estNombreSpecial(total1)) return reduit1.toString();
		if (estNombreSpecial(total2)) return reduit2.toString();
		
		return reduit1.toString();
	};

	const calculerDynamique = (racine1, racine2, tronc) => {
		const extraireValeur = (valeur) => parseInt(valeur.split('/')[0] || valeur, 10);
		
		const total = extraireValeur(racine1) + extraireValeur(racine2) + extraireValeur(tronc);
		const reduit = reduireNombre(total);
		
		return MAITRES_NOMBRES.has(total) ? reduit.toString() : reduit.toString();
	};

	const calculerEcorce = (jour) => reduireNombre(jour).toString();

	const calculerBranches = (prenoms, nom) => {
		const texteComplet = normaliserTexte(`${prenoms} ${nom}`);
		return texteComplet
			.split('')
			.filter(lettre => ['A', 'J', 'S'].includes(lettre))
			.length
			.toString();
	};

	const calculerValeursVoyellesConsonnes = (prenoms, nom, sontVoyelles) => {
		const texteComplet = normaliserTexte(`${prenoms} ${nom}`);
		const total = texteComplet
			.split('')
			.filter(lettre => sontVoyelles ? VOYELLES.has(lettre) : !VOYELLES.has(lettre))
			.reduce((sum, lettre) => sum + (LETTRE_VALEUR[lettre] || 0), 0);
		
		const reduit = reduireNombre(total);
		return estNombreSpecial(total) ? reduit.toString() : reduit.toString();
	};

	const calculerFeuilles = (prenoms, nom) => calculerValeursVoyellesConsonnes(prenoms, nom, true);
	const calculerFruits = (prenoms, nom) => calculerValeursVoyellesConsonnes(prenoms, nom, false);

	const calculerQualites = (prenoms, nom) => {
		const texteComplet = normaliserTexte(`${prenoms} ${nom}`);
		const qualites = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
		
		texteComplet
			.split('')
			.forEach(lettre => {
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

	const chercherMemoires = (prenoms, nom, jour, mois, annee) => {
		const memoires = [];
		
		// Vérification des dates de naissance
		if (MEMOIRES_FAMILIALES.has(jour)) {
			memoires.push({ nombre: jour, lieu: 'Jour de naissance', importance: 'Très forte' });
		}
		
		const totalAnnee = annee.toString()
			.split('')
			.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
		
		if (MEMOIRES_FAMILIALES.has(totalAnnee)) {
			memoires.push({ nombre: totalAnnee, lieu: 'Année de naissance', importance: 'Très forte' });
		}
		
		// Vérification dans les calculs principaux
		const valeursAVerifier = [
			{ valeur: calculerRacine1(jour, mois, annee), lieu: 'Première racine (Chemin de vie)', importance: 'Très forte' },
			{ valeur: calculerRacine2(prenoms, nom), lieu: 'Seconde racine (Expression)', importance: 'Très forte' },
			{ valeur: calculerTronc(jour, mois), lieu: 'Tronc (Clé de l\'âme)', importance: 'Très forte' },
			{ valeur: calculerFeuilles(prenoms, nom), lieu: 'Feuilles (Besoins affectifs)', importance: 'Forte' },
			{ valeur: calculerFruits(prenoms, nom), lieu: 'Fruits (Besoins de réalisation)', importance: 'Forte' }
		];
		
		valeursAVerifier.forEach(({ valeur, lieu, importance }) => {
			if (valeur.includes('/')) {
				const sousNombre = parseInt(valeur.split('/')[0], 10);
				if (MEMOIRES_FAMILIALES.has(sousNombre)) {
					memoires.push({ nombre: sousNombre, lieu, importance });
				}
			}
		});
		
		return memoires;
	};

	const calculerDefis = (jour, mois, annee) => {
		const [jourR, moisR, anneeR] = [jour, mois, annee].map(reduireNombre);
		
		const calculerDefi = (a, b) => {
			const diff = Math.abs(a - b);
			return diff === 0 ? 9 : diff;
		};
		
		const defi1 = calculerDefi(jourR, moisR);
		const defi2 = calculerDefi(jourR, anneeR);
		const defi3 = calculerDefi(defi1, defi2);
		const defi4 = calculerDefi(moisR, anneeR);
		
		return { defi1, defi2, defi3, defi4 };
	};

	const calculerAnneePersonnelle = (jour, mois, anneeActuelle = new Date().getFullYear()) => 
		reduireNombre(jour + mois + anneeActuelle);

	// Exécution des calculs principaux
	const resultats = {
		racine1: calculerRacine1(jour, mois, annee),
		racine2: calculerRacine2(prenoms, nom),
		tronc: calculerTronc(jour, mois),
		ecorce: calculerEcorce(jour),
		branches: calculerBranches(prenoms, nom),
		feuilles: calculerFeuilles(prenoms, nom),
		fruits: calculerFruits(prenoms, nom),
		qualites: calculerQualites(prenoms, nom),
		defis: calculerDefis(jour, mois, annee),
		anneePersonnelle: calculerAnneePersonnelle(jour, mois)
	};
	
	// Calculs dépendants
	resultats.dynamique = calculerDynamique(resultats.racine1, resultats.racine2, resultats.tronc);
	resultats.memoires = chercherMemoires(prenoms, nom, jour, mois, annee);

	return JSON.stringify(resultats);
};