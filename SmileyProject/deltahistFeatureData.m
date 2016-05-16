% Import data into matlab
uiimport

%%
display(feature_import)

n_groups = 4
[group, shapes] = kmeans(feature_import(:,36:69), ...
    n_groups, 'Replicates', 10, 'Distance', 'cosine');

figure(1)
plot(shapes')

figure(2)
plot(feature_import( group== 5, :)')
%%
plot(feature_import')
mask = sum(feature_import(:,1:34)') == 0
plot(feature_import( 11,:)')