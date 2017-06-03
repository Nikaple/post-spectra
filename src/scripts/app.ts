import '../styles/base.scss';

import { Tooltip } from './utils/tooltip';
import { H1Component } from './h1Component';
import { C13Component } from './c13Component';
import { MassComponent } from './massComponent';

// All components are implemented in singleton pattern
Tooltip.getInstance();
H1Component.getInstance();
C13Component.getInstance();
MassComponent.getInstance();
