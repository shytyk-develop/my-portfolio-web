import {
  createIcons,
  Blocks,
  Box,
  Check,
  ChevronUp,
  Code2,
  Database,
  Minus,
  Moon,
  Sun,
  Trash2,
} from 'lucide';

const icons = {
  Moon,
  Sun,
  Check,
  Code2,
  Database,
  Box,
  Blocks,
  Trash2,
  Minus,
  ChevronUp,
};

export function refreshIcons() {
  createIcons({ icons, nameAttr: 'data-lucide' });
}
