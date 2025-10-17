import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { undo, redo } from '../../redux/slices/editorSlice';

const UndoRedoToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { history, historyIndex } = useAppSelector(state => state.editor);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  useEffect(() => {
    console.log('UndoRedoToolbar state:', { history: history.length, historyIndex, canUndo, canRedo });
  }, [history, historyIndex, canUndo, canRedo]);

  const handleUndo = () => {
    console.log('Undo clicked - can undo:', canUndo, 'historyIndex:', historyIndex, 'history.length:', history.length);
    dispatch(undo());
  };

  const handleRedo = () => {
    console.log('Redo clicked - can redo:', canRedo, 'historyIndex:', historyIndex, 'history.length:', history.length);
    dispatch(redo());
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleUndo}
        type="button"
        className={`
          px-3 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-2
          ${canUndo 
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
        title="Undo (Ctrl+Z)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 100 14H9.071M3 15a1 1 0 100 2h2.071a7 7 0 001.414-13.999H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>Undo</span>
      </button>
      
      <span className="text-sm text-gray-600 font-semibold px-2">
        {historyIndex + 1}/{history.length}
      </span>
      
      <button
        onClick={handleRedo}
        type="button"
        className={`
          px-3 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-2
          ${canRedo 
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
        title="Redo (Ctrl+Y)"
      >
        <span>Redo</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H9a7 7 0 100 14h1.929a1 1 0 100-2H9a5 5 0 110-10h5.586l-2.293 2.293a1 1 0 001.414 1.414l4-4z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default UndoRedoToolbar;
