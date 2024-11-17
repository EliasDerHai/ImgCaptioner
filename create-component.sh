#!/bin/bash

DIRECTORY_NAME=$1
COMPONENT_NAME=$2

COMPONENT_DIR="src/$DIRECTORY_NAME"

mkdir -p $COMPONENT_DIR

cat > $COMPONENT_DIR/$COMPONENT_NAME.tsx <<EOL
import { Component } from 'solid-js';
import styles from './$COMPONENT_NAME.module.css';

const $COMPONENT_NAME: Component = () => {
  return (
    <div class={styles.container}>
      Hello from $COMPONENT_NAME!
    </div>
  );
};

export default $COMPONENT_NAME;
EOL

cat > $COMPONENT_DIR/$COMPONENT_NAME.module.css <<EOL
EOL

echo "Component $COMPONENT_NAME created with .tsx and .css module."
