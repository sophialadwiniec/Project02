public void delete(Comparable item){
  	 root = delete(root,item); 
}

public Node delete(Node tree, Comparable elem){
    if(tree == null)
        return null;
    if(tree.data.compareTo(elem)==0){
      if(tree.left==null)
        return tree.right;
      else if(tree.right==null)
        return tree.left;
    else{
      if(tree.right.left==null){
          tree.data=tree.right.data;
          tree.right=tree.right.right;
          return tree;
      } else{
        tree.data=removeSmallest(tree.right);
        return tree;
        }
    }
  }

    else if(elem.compareTo((T)tree.data) < 0){
        tree.left = delete(tree.left, elem);
        return tree;
    }

    else{
        tree.right = delete(tree.right, elem);
        return tree;
    }
}